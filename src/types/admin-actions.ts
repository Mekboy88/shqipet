
export interface UserAction {
  id: string;
  timestamp: string;
  user_id: string;
  username: string;
  email: string;
  action_type: string;
  action_description: string;
  affected_resource: string;
  target_username?: string;
  device_type: string;
  ip_address: string;
  location: string;
  browser_os: string;
  action_status: 'success' | 'warning' | 'failed';
  additional_data?: any;
}
