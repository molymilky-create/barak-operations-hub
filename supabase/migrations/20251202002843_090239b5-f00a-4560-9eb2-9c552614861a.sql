-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE app_role AS ENUM ('admin', 'user');
CREATE TYPE lead_status AS ENUM ('NEW', 'CONTACTED', 'QUOTED', 'WON', 'LOST');
CREATE TYPE task_status AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING_CLIENT', 'WAITING_COMPANY', 'WAITING_MANAGER_REVIEW', 'DONE', 'CANCELLED');
CREATE TYPE task_kind AS ENUM ('LEAD', 'RENEWAL', 'COLLECTION', 'CARRIER_REQUEST', 'CERTIFICATE', 'OTHER');
CREATE TYPE task_priority AS ENUM ('LOW', 'NORMAL', 'HIGH', 'CRITICAL');
CREATE TYPE renewal_status AS ENUM ('NEW', 'IN_PROGRESS', 'QUOTED', 'WAITING_CLIENT', 'COMPLETED', 'CANCELLED');
CREATE TYPE collection_status AS ENUM ('NEW', 'REMINDER_SENT', 'PARTIAL', 'PAID', 'WRITTEN_OFF');
CREATE TYPE claim_status AS ENUM ('OPENED', 'IN_PROGRESS', 'SENT_TO_COMPANY', 'PAID', 'CLOSED');
CREATE TYPE timeoff_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE certificate_mode AS ENUM ('NORMAL', 'REQUESTOR');
CREATE TYPE insurance_company AS ENUM ('MENORA', 'HACHSHARA', 'OTHER');
CREATE TYPE product_type AS ENUM ('FARM', 'HORSE', 'INSTRUCTOR', 'TRAINER', 'VEHICLE', 'LIFE', 'OTHER');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Anyone can view roles"
  ON public.user_roles FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Clients table (מבוטחים)
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  id_number TEXT,
  business_number TEXT,
  business_name TEXT,
  home_address TEXT,
  business_address TEXT,
  phone TEXT,
  email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view clients"
  ON public.clients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage clients"
  ON public.clients FOR ALL
  TO authenticated
  USING (true);

-- Policies table (פוליסות)
CREATE TABLE public.policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  company insurance_company NOT NULL,
  product_type product_type NOT NULL,
  policy_number TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  annual_premium DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view policies"
  ON public.policies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage policies"
  ON public.policies FOR ALL
  TO authenticated
  USING (true);

-- Leads table (לידים)
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  source TEXT,
  status lead_status NOT NULL DEFAULT 'NEW',
  field TEXT,
  estimated_annual_premium DECIMAL(10,2),
  next_action_date DATE,
  next_action_notes TEXT,
  last_channel TEXT,
  assigned_to_user_id UUID REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view assigned leads"
  ON public.leads FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    assigned_to_user_id = auth.uid()
  );

CREATE POLICY "Users can manage assigned leads"
  ON public.leads FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    assigned_to_user_id = auth.uid()
  );

-- Tasks table (משימות)
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  kind task_kind NOT NULL,
  status task_status NOT NULL DEFAULT 'OPEN',
  priority task_priority NOT NULL DEFAULT 'NORMAL',
  assigned_to_user_id UUID REFERENCES public.profiles(id),
  created_by_user_id UUID REFERENCES public.profiles(id),
  related_client_name TEXT,
  requires_manager_review BOOLEAN DEFAULT false,
  manager_approved_at TIMESTAMPTZ,
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view assigned tasks"
  ON public.tasks FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    assigned_to_user_id = auth.uid() OR
    created_by_user_id = auth.uid()
  );

CREATE POLICY "Users can manage assigned tasks"
  ON public.tasks FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    assigned_to_user_id = auth.uid() OR
    created_by_user_id = auth.uid()
  );

-- Renewals table (חידושים)
CREATE TABLE public.renewals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  policy_id UUID NOT NULL REFERENCES public.policies(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  assigned_to_user_id UUID REFERENCES public.profiles(id),
  renewal_date DATE NOT NULL,
  previous_premium DECIMAL(10,2),
  expected_premium DECIMAL(10,2),
  status renewal_status NOT NULL DEFAULT 'NEW',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.renewals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view renewals"
  ON public.renewals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage renewals"
  ON public.renewals FOR ALL
  TO authenticated
  USING (true);

-- Collections table (גבייה)
CREATE TABLE public.collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  policy_id UUID NOT NULL REFERENCES public.policies(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status collection_status NOT NULL DEFAULT 'NEW',
  assigned_to_user_id UUID REFERENCES public.profiles(id),
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view collections"
  ON public.collections FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage collections"
  ON public.collections FOR ALL
  TO authenticated
  USING (true);

-- Claims table (תביעות)
CREATE TABLE public.claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  policy_id UUID REFERENCES public.policies(id) ON DELETE SET NULL,
  claim_type TEXT NOT NULL,
  status claim_status NOT NULL DEFAULT 'OPENED',
  event_date DATE NOT NULL,
  report_date DATE NOT NULL,
  last_update_date DATE,
  estimated_amount DECIMAL(10,2),
  paid_amount DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view claims"
  ON public.claims FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage claims"
  ON public.claims FOR ALL
  TO authenticated
  USING (true);

-- Certificates table (אישורי קיום)
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  policy_id UUID REFERENCES public.policies(id) ON DELETE SET NULL,
  mode certificate_mode NOT NULL DEFAULT 'NORMAL',
  requestor_id TEXT,
  requestor_name TEXT,
  product_type product_type,
  codes TEXT[],
  free_text TEXT,
  created_by_user_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view certificates"
  ON public.certificates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage certificates"
  ON public.certificates FOR ALL
  TO authenticated
  USING (true);

-- Documents table (מסמכים)
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  source TEXT,
  doc_type TEXT NOT NULL,
  product_type product_type,
  file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view documents"
  ON public.documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage documents"
  ON public.documents FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Regulations table (חוקים וחוזרים)
CREATE TABLE public.regulations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  year INTEGER,
  tags TEXT[],
  file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.regulations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view regulations"
  ON public.regulations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage regulations"
  ON public.regulations FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Employees table (עובדים)
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  position TEXT,
  manager_id UUID REFERENCES public.employees(id),
  hire_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view employees"
  ON public.employees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage employees"
  ON public.employees FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Employee time off table (חופשות)
CREATE TABLE public.employee_time_off (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  status timeoff_status NOT NULL DEFAULT 'PENDING',
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.employee_time_off ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own time off requests"
  ON public.employee_time_off FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create own time off requests"
  ON public.employee_time_off FOR INSERT
  TO authenticated
  WITH CHECK (
    employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
  );

CREATE POLICY "Only admins can update time off requests"
  ON public.employee_time_off FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Commission agreements table (הסכמי עמלות)
CREATE TABLE public.commission_agreements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company insurance_company NOT NULL,
  product_type product_type NOT NULL,
  description TEXT,
  rate_percent DECIMAL(5,2) NOT NULL,
  base_type TEXT NOT NULL CHECK (base_type IN ('GROSS', 'NET')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(company, product_type)
);

ALTER TABLE public.commission_agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view commission agreements"
  ON public.commission_agreements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage commission agreements"
  ON public.commission_agreements FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Commission entries table (רשומות עמלות)
CREATE TABLE public.commission_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  policy_id UUID NOT NULL REFERENCES public.policies(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  company insurance_company NOT NULL,
  product_type product_type NOT NULL,
  gross_premium DECIMAL(10,2) NOT NULL,
  net_premium DECIMAL(10,2) NOT NULL,
  final_commission DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.commission_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view commission entries"
  ON public.commission_entries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage commission entries"
  ON public.commission_entries FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Calculators table (מחשבונים - No-Code Builder)
CREATE TABLE public.calculators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  field TEXT NOT NULL,
  company insurance_company NOT NULL,
  product_type product_type NOT NULL,
  description TEXT,
  result_label TEXT DEFAULT 'פרמיה שנתית',
  warning_text TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.calculators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view calculators"
  ON public.calculators FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage calculators"
  ON public.calculators FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Calculator fields table (שדות מחשבון)
CREATE TABLE public.calculator_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  calculator_id UUID NOT NULL REFERENCES public.calculators(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  field_label TEXT NOT NULL,
  field_type TEXT NOT NULL CHECK (field_type IN ('number', 'text', 'select', 'boolean', 'date')),
  is_required BOOLEAN DEFAULT false,
  placeholder TEXT,
  options TEXT[],
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.calculator_fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view calculator fields"
  ON public.calculator_fields FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage calculator fields"
  ON public.calculator_fields FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Calculator rules table (חוקי חישוב)
CREATE TABLE public.calculator_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  calculator_id UUID NOT NULL REFERENCES public.calculators(id) ON DELETE CASCADE,
  condition_field TEXT NOT NULL,
  condition_operator TEXT NOT NULL CHECK (condition_operator IN ('=', '>', '<', '>=', '<=', '!=', 'contains')),
  condition_value TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('add_fixed', 'multiply', 'percentage', 'discount')),
  action_value DECIMAL(10,2) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.calculator_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view calculator rules"
  ON public.calculator_rules FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage calculator rules"
  ON public.calculator_rules FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON public.policies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_renewals_updated_at BEFORE UPDATE ON public.renewals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON public.collections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON public.claims FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_regulations_updated_at BEFORE UPDATE ON public.regulations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_commission_agreements_updated_at BEFORE UPDATE ON public.commission_agreements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_calculators_updated_at BEFORE UPDATE ON public.calculators FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();