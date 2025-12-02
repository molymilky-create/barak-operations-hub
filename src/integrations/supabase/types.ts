export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      calculator_fields: {
        Row: {
          calculator_id: string
          created_at: string
          field_label: string
          field_name: string
          field_type: string
          id: string
          is_required: boolean | null
          options: string[] | null
          placeholder: string | null
          sort_order: number | null
        }
        Insert: {
          calculator_id: string
          created_at?: string
          field_label: string
          field_name: string
          field_type: string
          id?: string
          is_required?: boolean | null
          options?: string[] | null
          placeholder?: string | null
          sort_order?: number | null
        }
        Update: {
          calculator_id?: string
          created_at?: string
          field_label?: string
          field_name?: string
          field_type?: string
          id?: string
          is_required?: boolean | null
          options?: string[] | null
          placeholder?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "calculator_fields_calculator_id_fkey"
            columns: ["calculator_id"]
            isOneToOne: false
            referencedRelation: "calculators"
            referencedColumns: ["id"]
          },
        ]
      }
      calculator_rules: {
        Row: {
          action_type: string
          action_value: number
          calculator_id: string
          condition_field: string
          condition_operator: string
          condition_value: string
          created_at: string
          id: string
          sort_order: number | null
        }
        Insert: {
          action_type: string
          action_value: number
          calculator_id: string
          condition_field: string
          condition_operator: string
          condition_value: string
          created_at?: string
          id?: string
          sort_order?: number | null
        }
        Update: {
          action_type?: string
          action_value?: number
          calculator_id?: string
          condition_field?: string
          condition_operator?: string
          condition_value?: string
          created_at?: string
          id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "calculator_rules_calculator_id_fkey"
            columns: ["calculator_id"]
            isOneToOne: false
            referencedRelation: "calculators"
            referencedColumns: ["id"]
          },
        ]
      }
      calculators: {
        Row: {
          company: Database["public"]["Enums"]["insurance_company"]
          created_at: string
          description: string | null
          field: string
          id: string
          is_active: boolean | null
          name: string
          product_type: Database["public"]["Enums"]["product_type"]
          result_label: string | null
          updated_at: string
          warning_text: string | null
        }
        Insert: {
          company: Database["public"]["Enums"]["insurance_company"]
          created_at?: string
          description?: string | null
          field: string
          id?: string
          is_active?: boolean | null
          name: string
          product_type: Database["public"]["Enums"]["product_type"]
          result_label?: string | null
          updated_at?: string
          warning_text?: string | null
        }
        Update: {
          company?: Database["public"]["Enums"]["insurance_company"]
          created_at?: string
          description?: string | null
          field?: string
          id?: string
          is_active?: boolean | null
          name?: string
          product_type?: Database["public"]["Enums"]["product_type"]
          result_label?: string | null
          updated_at?: string
          warning_text?: string | null
        }
        Relationships: []
      }
      certificates: {
        Row: {
          client_id: string
          codes: string[] | null
          created_at: string
          created_by_user_id: string | null
          free_text: string | null
          id: string
          mode: Database["public"]["Enums"]["certificate_mode"]
          policy_id: string | null
          product_type: Database["public"]["Enums"]["product_type"] | null
          requestor_id: string | null
          requestor_name: string | null
        }
        Insert: {
          client_id: string
          codes?: string[] | null
          created_at?: string
          created_by_user_id?: string | null
          free_text?: string | null
          id?: string
          mode?: Database["public"]["Enums"]["certificate_mode"]
          policy_id?: string | null
          product_type?: Database["public"]["Enums"]["product_type"] | null
          requestor_id?: string | null
          requestor_name?: string | null
        }
        Update: {
          client_id?: string
          codes?: string[] | null
          created_at?: string
          created_by_user_id?: string | null
          free_text?: string | null
          id?: string
          mode?: Database["public"]["Enums"]["certificate_mode"]
          policy_id?: string | null
          product_type?: Database["public"]["Enums"]["product_type"] | null
          requestor_id?: string | null
          requestor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      claims: {
        Row: {
          claim_type: string
          client_id: string
          created_at: string
          estimated_amount: number | null
          event_date: string
          id: string
          last_update_date: string | null
          notes: string | null
          paid_amount: number | null
          policy_id: string | null
          report_date: string
          status: Database["public"]["Enums"]["claim_status"]
          updated_at: string
        }
        Insert: {
          claim_type: string
          client_id: string
          created_at?: string
          estimated_amount?: number | null
          event_date: string
          id?: string
          last_update_date?: string | null
          notes?: string | null
          paid_amount?: number | null
          policy_id?: string | null
          report_date: string
          status?: Database["public"]["Enums"]["claim_status"]
          updated_at?: string
        }
        Update: {
          claim_type?: string
          client_id?: string
          created_at?: string
          estimated_amount?: number | null
          event_date?: string
          id?: string
          last_update_date?: string | null
          notes?: string | null
          paid_amount?: number | null
          policy_id?: string | null
          report_date?: string
          status?: Database["public"]["Enums"]["claim_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "claims_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          business_address: string | null
          business_name: string | null
          business_number: string | null
          created_at: string
          email: string | null
          home_address: string | null
          id: string
          id_number: string | null
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          business_address?: string | null
          business_name?: string | null
          business_number?: string | null
          created_at?: string
          email?: string | null
          home_address?: string | null
          id?: string
          id_number?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          business_address?: string | null
          business_name?: string | null
          business_number?: string | null
          created_at?: string
          email?: string | null
          home_address?: string | null
          id?: string
          id_number?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      collections: {
        Row: {
          amount: number
          assigned_to_user_id: string | null
          client_id: string
          created_at: string
          due_date: string | null
          id: string
          notes: string | null
          policy_id: string
          status: Database["public"]["Enums"]["collection_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          assigned_to_user_id?: string | null
          client_id: string
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          policy_id: string
          status?: Database["public"]["Enums"]["collection_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          assigned_to_user_id?: string | null
          client_id?: string
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          policy_id?: string
          status?: Database["public"]["Enums"]["collection_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collections_assigned_to_user_id_fkey"
            columns: ["assigned_to_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collections_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collections_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_agreements: {
        Row: {
          base_type: string
          company: Database["public"]["Enums"]["insurance_company"]
          created_at: string
          description: string | null
          id: string
          product_type: Database["public"]["Enums"]["product_type"]
          rate_percent: number
          updated_at: string
        }
        Insert: {
          base_type: string
          company: Database["public"]["Enums"]["insurance_company"]
          created_at?: string
          description?: string | null
          id?: string
          product_type: Database["public"]["Enums"]["product_type"]
          rate_percent: number
          updated_at?: string
        }
        Update: {
          base_type?: string
          company?: Database["public"]["Enums"]["insurance_company"]
          created_at?: string
          description?: string | null
          id?: string
          product_type?: Database["public"]["Enums"]["product_type"]
          rate_percent?: number
          updated_at?: string
        }
        Relationships: []
      }
      commission_entries: {
        Row: {
          client_id: string
          company: Database["public"]["Enums"]["insurance_company"]
          created_at: string
          final_commission: number
          gross_premium: number
          id: string
          net_premium: number
          policy_id: string
          product_type: Database["public"]["Enums"]["product_type"]
        }
        Insert: {
          client_id: string
          company: Database["public"]["Enums"]["insurance_company"]
          created_at?: string
          final_commission: number
          gross_premium: number
          id?: string
          net_premium: number
          policy_id: string
          product_type: Database["public"]["Enums"]["product_type"]
        }
        Update: {
          client_id?: string
          company?: Database["public"]["Enums"]["insurance_company"]
          created_at?: string
          final_commission?: number
          gross_premium?: number
          id?: string
          net_premium?: number
          policy_id?: string
          product_type?: Database["public"]["Enums"]["product_type"]
        }
        Relationships: [
          {
            foreignKeyName: "commission_entries_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_entries_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          description: string | null
          doc_type: string
          file_url: string | null
          id: string
          product_type: Database["public"]["Enums"]["product_type"] | null
          source: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          doc_type: string
          file_url?: string | null
          id?: string
          product_type?: Database["public"]["Enums"]["product_type"] | null
          source?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          doc_type?: string
          file_url?: string | null
          id?: string
          product_type?: Database["public"]["Enums"]["product_type"] | null
          source?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      employee_time_off: {
        Row: {
          created_at: string
          employee_id: string
          from_date: string
          id: string
          reason: string | null
          status: Database["public"]["Enums"]["timeoff_status"]
          to_date: string
        }
        Insert: {
          created_at?: string
          employee_id: string
          from_date: string
          id?: string
          reason?: string | null
          status?: Database["public"]["Enums"]["timeoff_status"]
          to_date: string
        }
        Update: {
          created_at?: string
          employee_id?: string
          from_date?: string
          id?: string
          reason?: string | null
          status?: Database["public"]["Enums"]["timeoff_status"]
          to_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_time_off_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          created_at: string
          email: string
          hire_date: string | null
          id: string
          manager_id: string | null
          name: string
          position: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          hire_date?: string | null
          id?: string
          manager_id?: string | null
          name: string
          position?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          hire_date?: string | null
          id?: string
          manager_id?: string | null
          name?: string
          position?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to_user_id: string | null
          client_name: string
          created_at: string
          email: string | null
          estimated_annual_premium: number | null
          field: string | null
          id: string
          last_channel: string | null
          next_action_date: string | null
          next_action_notes: string | null
          notes: string | null
          phone: string | null
          source: string | null
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
        }
        Insert: {
          assigned_to_user_id?: string | null
          client_name: string
          created_at?: string
          email?: string | null
          estimated_annual_premium?: number | null
          field?: string | null
          id?: string
          last_channel?: string | null
          next_action_date?: string | null
          next_action_notes?: string | null
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Update: {
          assigned_to_user_id?: string | null
          client_name?: string
          created_at?: string
          email?: string | null
          estimated_annual_premium?: number | null
          field?: string | null
          id?: string
          last_channel?: string | null
          next_action_date?: string | null
          next_action_notes?: string | null
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_to_user_id_fkey"
            columns: ["assigned_to_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      policies: {
        Row: {
          annual_premium: number | null
          client_id: string
          company: Database["public"]["Enums"]["insurance_company"]
          created_at: string
          end_date: string
          id: string
          notes: string | null
          policy_number: string
          product_type: Database["public"]["Enums"]["product_type"]
          start_date: string
          updated_at: string
        }
        Insert: {
          annual_premium?: number | null
          client_id: string
          company: Database["public"]["Enums"]["insurance_company"]
          created_at?: string
          end_date: string
          id?: string
          notes?: string | null
          policy_number: string
          product_type: Database["public"]["Enums"]["product_type"]
          start_date: string
          updated_at?: string
        }
        Update: {
          annual_premium?: number | null
          client_id?: string
          company?: Database["public"]["Enums"]["insurance_company"]
          created_at?: string
          end_date?: string
          id?: string
          notes?: string | null
          policy_number?: string
          product_type?: Database["public"]["Enums"]["product_type"]
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "policies_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      regulations: {
        Row: {
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          tags: string[] | null
          title: string
          updated_at: string
          year: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      renewals: {
        Row: {
          assigned_to_user_id: string | null
          client_id: string
          created_at: string
          expected_premium: number | null
          id: string
          notes: string | null
          policy_id: string
          previous_premium: number | null
          renewal_date: string
          status: Database["public"]["Enums"]["renewal_status"]
          updated_at: string
        }
        Insert: {
          assigned_to_user_id?: string | null
          client_id: string
          created_at?: string
          expected_premium?: number | null
          id?: string
          notes?: string | null
          policy_id: string
          previous_premium?: number | null
          renewal_date: string
          status?: Database["public"]["Enums"]["renewal_status"]
          updated_at?: string
        }
        Update: {
          assigned_to_user_id?: string | null
          client_id?: string
          created_at?: string
          expected_premium?: number | null
          id?: string
          notes?: string | null
          policy_id?: string
          previous_premium?: number | null
          renewal_date?: string
          status?: Database["public"]["Enums"]["renewal_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "renewals_assigned_to_user_id_fkey"
            columns: ["assigned_to_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "renewals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "renewals_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to_user_id: string | null
          created_at: string
          created_by_user_id: string | null
          description: string | null
          due_date: string | null
          id: string
          kind: Database["public"]["Enums"]["task_kind"]
          manager_approved_at: string | null
          priority: Database["public"]["Enums"]["task_priority"]
          related_client_name: string | null
          requires_manager_review: boolean | null
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to_user_id?: string | null
          created_at?: string
          created_by_user_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          kind: Database["public"]["Enums"]["task_kind"]
          manager_approved_at?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          related_client_name?: string | null
          requires_manager_review?: boolean | null
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to_user_id?: string | null
          created_at?: string
          created_by_user_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["task_kind"]
          manager_approved_at?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          related_client_name?: string | null
          requires_manager_review?: boolean | null
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_user_id_fkey"
            columns: ["assigned_to_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_actions: {
        Row: {
          action_config: Json
          action_type: Database["public"]["Enums"]["workflow_action_type"]
          created_at: string
          id: string
          sort_order: number | null
          workflow_id: string
        }
        Insert: {
          action_config?: Json
          action_type: Database["public"]["Enums"]["workflow_action_type"]
          created_at?: string
          id?: string
          sort_order?: number | null
          workflow_id: string
        }
        Update: {
          action_config?: Json
          action_type?: Database["public"]["Enums"]["workflow_action_type"]
          created_at?: string
          id?: string
          sort_order?: number | null
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_actions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_conditions: {
        Row: {
          created_at: string
          field: string
          id: string
          logic_operator: string | null
          operator: string
          sort_order: number | null
          value: string
          workflow_id: string
        }
        Insert: {
          created_at?: string
          field: string
          id?: string
          logic_operator?: string | null
          operator: string
          sort_order?: number | null
          value: string
          workflow_id: string
        }
        Update: {
          created_at?: string
          field?: string
          id?: string
          logic_operator?: string | null
          operator?: string
          sort_order?: number | null
          value?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_conditions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_logs: {
        Row: {
          error_message: string | null
          executed_at: string
          id: string
          result: Json | null
          status: string
          trigger_data: Json | null
          workflow_id: string
        }
        Insert: {
          error_message?: string | null
          executed_at?: string
          id?: string
          result?: Json | null
          status?: string
          trigger_data?: Json | null
          workflow_id: string
        }
        Update: {
          error_message?: string | null
          executed_at?: string
          id?: string
          result?: Json | null
          status?: string
          trigger_data?: Json | null
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_logs_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          description: string | null
          id: string
          name: string
          status: Database["public"]["Enums"]["workflow_status"]
          trigger_config: Json | null
          trigger_type: Database["public"]["Enums"]["workflow_trigger_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          description?: string | null
          id?: string
          name: string
          status?: Database["public"]["Enums"]["workflow_status"]
          trigger_config?: Json | null
          trigger_type: Database["public"]["Enums"]["workflow_trigger_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          description?: string | null
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["workflow_status"]
          trigger_config?: Json | null
          trigger_type?: Database["public"]["Enums"]["workflow_trigger_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflows_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      certificate_mode: "NORMAL" | "REQUESTOR"
      claim_status:
        | "OPENED"
        | "IN_PROGRESS"
        | "SENT_TO_COMPANY"
        | "PAID"
        | "CLOSED"
      collection_status:
        | "NEW"
        | "REMINDER_SENT"
        | "PARTIAL"
        | "PAID"
        | "WRITTEN_OFF"
      insurance_company: "MENORA" | "HACHSHARA" | "OTHER"
      lead_status: "NEW" | "CONTACTED" | "QUOTED" | "WON" | "LOST"
      product_type:
        | "FARM"
        | "HORSE"
        | "INSTRUCTOR"
        | "TRAINER"
        | "VEHICLE"
        | "LIFE"
        | "OTHER"
      renewal_status:
        | "NEW"
        | "IN_PROGRESS"
        | "QUOTED"
        | "WAITING_CLIENT"
        | "COMPLETED"
        | "CANCELLED"
      task_kind:
        | "LEAD"
        | "RENEWAL"
        | "COLLECTION"
        | "CARRIER_REQUEST"
        | "CERTIFICATE"
        | "OTHER"
      task_priority: "LOW" | "NORMAL" | "HIGH" | "CRITICAL"
      task_status:
        | "OPEN"
        | "IN_PROGRESS"
        | "WAITING_CLIENT"
        | "WAITING_COMPANY"
        | "WAITING_MANAGER_REVIEW"
        | "DONE"
        | "CANCELLED"
      timeoff_status: "PENDING" | "APPROVED" | "REJECTED"
      workflow_action_type:
        | "CREATE_TASK"
        | "UPDATE_STATUS"
        | "SEND_EMAIL"
        | "SEND_SMS"
        | "ADD_NOTE"
        | "ASSIGN_USER"
        | "CREATE_REMINDER"
      workflow_status: "ACTIVE" | "INACTIVE" | "DRAFT"
      workflow_trigger_type:
        | "LEAD_CREATED"
        | "LEAD_STATUS_CHANGED"
        | "TASK_CREATED"
        | "TASK_OVERDUE"
        | "TASK_STATUS_CHANGED"
        | "RENEWAL_DUE"
        | "COLLECTION_DUE"
        | "CLAIM_CREATED"
        | "CLAIM_STATUS_CHANGED"
        | "SCHEDULE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      certificate_mode: ["NORMAL", "REQUESTOR"],
      claim_status: [
        "OPENED",
        "IN_PROGRESS",
        "SENT_TO_COMPANY",
        "PAID",
        "CLOSED",
      ],
      collection_status: [
        "NEW",
        "REMINDER_SENT",
        "PARTIAL",
        "PAID",
        "WRITTEN_OFF",
      ],
      insurance_company: ["MENORA", "HACHSHARA", "OTHER"],
      lead_status: ["NEW", "CONTACTED", "QUOTED", "WON", "LOST"],
      product_type: [
        "FARM",
        "HORSE",
        "INSTRUCTOR",
        "TRAINER",
        "VEHICLE",
        "LIFE",
        "OTHER",
      ],
      renewal_status: [
        "NEW",
        "IN_PROGRESS",
        "QUOTED",
        "WAITING_CLIENT",
        "COMPLETED",
        "CANCELLED",
      ],
      task_kind: [
        "LEAD",
        "RENEWAL",
        "COLLECTION",
        "CARRIER_REQUEST",
        "CERTIFICATE",
        "OTHER",
      ],
      task_priority: ["LOW", "NORMAL", "HIGH", "CRITICAL"],
      task_status: [
        "OPEN",
        "IN_PROGRESS",
        "WAITING_CLIENT",
        "WAITING_COMPANY",
        "WAITING_MANAGER_REVIEW",
        "DONE",
        "CANCELLED",
      ],
      timeoff_status: ["PENDING", "APPROVED", "REJECTED"],
      workflow_action_type: [
        "CREATE_TASK",
        "UPDATE_STATUS",
        "SEND_EMAIL",
        "SEND_SMS",
        "ADD_NOTE",
        "ASSIGN_USER",
        "CREATE_REMINDER",
      ],
      workflow_status: ["ACTIVE", "INACTIVE", "DRAFT"],
      workflow_trigger_type: [
        "LEAD_CREATED",
        "LEAD_STATUS_CHANGED",
        "TASK_CREATED",
        "TASK_OVERDUE",
        "TASK_STATUS_CHANGED",
        "RENEWAL_DUE",
        "COLLECTION_DUE",
        "CLAIM_CREATED",
        "CLAIM_STATUS_CHANGED",
        "SCHEDULE",
      ],
    },
  },
} as const
