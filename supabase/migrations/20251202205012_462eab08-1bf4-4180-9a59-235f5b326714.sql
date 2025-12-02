-- Create workflow status enum
CREATE TYPE public.workflow_status AS ENUM ('ACTIVE', 'INACTIVE', 'DRAFT');

-- Create trigger type enum
CREATE TYPE public.workflow_trigger_type AS ENUM (
  'LEAD_CREATED',
  'LEAD_STATUS_CHANGED', 
  'TASK_CREATED',
  'TASK_OVERDUE',
  'TASK_STATUS_CHANGED',
  'RENEWAL_DUE',
  'COLLECTION_DUE',
  'CLAIM_CREATED',
  'CLAIM_STATUS_CHANGED',
  'SCHEDULE'
);

-- Create action type enum
CREATE TYPE public.workflow_action_type AS ENUM (
  'CREATE_TASK',
  'UPDATE_STATUS',
  'SEND_EMAIL',
  'SEND_SMS',
  'ADD_NOTE',
  'ASSIGN_USER',
  'CREATE_REMINDER'
);

-- Workflows table - main workflow definitions
CREATE TABLE public.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  trigger_type workflow_trigger_type NOT NULL,
  trigger_config JSONB DEFAULT '{}',
  status workflow_status NOT NULL DEFAULT 'DRAFT',
  created_by_user_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Workflow conditions table
CREATE TABLE public.workflow_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  field TEXT NOT NULL,
  operator TEXT NOT NULL,
  value TEXT NOT NULL,
  logic_operator TEXT DEFAULT 'AND',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Workflow actions table
CREATE TABLE public.workflow_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  action_type workflow_action_type NOT NULL,
  action_config JSONB NOT NULL DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Workflow execution log
CREATE TABLE public.workflow_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  trigger_data JSONB,
  status TEXT NOT NULL DEFAULT 'STARTED',
  result JSONB,
  error_message TEXT,
  executed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workflows
CREATE POLICY "Authenticated users can view workflows"
ON public.workflows FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only admins can manage workflows"
ON public.workflows FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for workflow_conditions
CREATE POLICY "Authenticated users can view workflow conditions"
ON public.workflow_conditions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only admins can manage workflow conditions"
ON public.workflow_conditions FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for workflow_actions
CREATE POLICY "Authenticated users can view workflow actions"
ON public.workflow_actions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only admins can manage workflow actions"
ON public.workflow_actions FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for workflow_logs
CREATE POLICY "Authenticated users can view workflow logs"
ON public.workflow_logs FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "System can insert workflow logs"
ON public.workflow_logs FOR INSERT
TO authenticated
WITH CHECK (true);

-- Add updated_at trigger
CREATE TRIGGER update_workflows_updated_at
BEFORE UPDATE ON public.workflows
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();