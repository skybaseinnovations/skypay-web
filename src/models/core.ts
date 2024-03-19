export interface Payment {
    id: string
    user_payment_provider_id: string
    provider_id: string
    provider_alias: string
    provider_name: string
    provider_logo_url: string
    mode: string
    amount: number
    status: string
    code: string
    created_at: string
    expires_at: string
  }