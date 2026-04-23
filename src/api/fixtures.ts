/**
 * Mock Automation Fixtures
 * These power GET /api/automations and the Automated Step node form.
 */
export const automations = [
  {
    id: 'send_email',
    name: 'Send Email',
    label: 'Send Email',
    description: 'Sends an email notification to a specified recipient.',
    paramsConfig: [
      { key: 'to', type: 'string', label: 'To (email address)' },
      { key: 'subject', type: 'string', label: 'Subject' },
      { key: 'body', type: 'text', label: 'Email Body' },
    ],
  },
  {
    id: 'generate_doc',
    name: 'Generate Document',
    label: 'Generate Document',
    description: 'Generates a document (offer letter, report, etc.) from a template.',
    paramsConfig: [
      { key: 'template', type: 'string', label: 'Template Name' },
      { key: 'recipient', type: 'string', label: 'Recipient Name' },
    ],
  },
  {
    id: 'update_db',
    name: 'Update Database Record',
    label: 'Update DB Record',
    description: 'Updates a record in the HR database.',
    paramsConfig: [
      { key: 'table', type: 'string', label: 'Table Name' },
      { key: 'recordId', type: 'string', label: 'Record ID' },
      { key: 'data', type: 'json', label: 'Data (JSON)' },
    ],
  },
  {
    id: 'slack_msg',
    name: 'Send Slack Message',
    label: 'Slack Notification',
    description: 'Posts a message to a Slack channel.',
    paramsConfig: [
      { key: 'channel', type: 'string', label: 'Channel ID' },
      { key: 'message', type: 'text', label: 'Message Text' },
    ],
  },
];
