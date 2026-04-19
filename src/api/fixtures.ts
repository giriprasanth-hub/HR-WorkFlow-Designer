export const automations = [
  {
    id: 'send_email',
    name: 'Send Email Notification',
    description: 'Automatically sends an email to the specified recipient.',
    paramsConfig: [
      { key: 'recipient', type: 'string', label: 'Recipient Email' },
      { key: 'subject', type: 'string', label: 'Subject line' },
      { key: 'body', type: 'text', label: 'Email Body' }
    ]
  },
  {
    id: 'update_db',
    name: 'Update Database Record',
    description: 'Updates a record in the HR database.',
    paramsConfig: [
      { key: 'table', type: 'string', label: 'Table Name' },
      { key: 'recordId', type: 'string', label: 'Record ID' },
      { key: 'data', type: 'json', label: 'Data (JSON)' }
    ]
  },
  {
    id: 'slack_msg',
    name: 'Send Slack Message',
    description: 'Sends a message to a Slack channel.',
    paramsConfig: [
      { key: 'channel', type: 'string', label: 'Channel ID' },
      { key: 'message', type: 'text', label: 'Message Text' }
    ]
  }
];
