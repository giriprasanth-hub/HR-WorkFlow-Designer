import React from 'react';

interface ParamConfig {
  key: string;
  type: 'string' | 'text' | 'json';
  label: string;
}

interface DynamicParamsFormProps {
  paramsConfig: ParamConfig[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
}

/**
 * Renders dynamic input fields for an Automated Step node
 * based on the selected automation's paramsConfig.
 */
export const DynamicParamsForm: React.FC<DynamicParamsFormProps> = ({
  paramsConfig,
  values,
  onChange,
}) => {
  if (!paramsConfig || paramsConfig.length === 0) return null;

  const handleChange = (key: string, val: string) => {
    onChange({ ...values, [key]: val });
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="form-label">Action Parameters</span>
      {paramsConfig.map((param) => (
        <div key={param.key} className="form-group">
          <label className="form-label" style={{ textTransform: 'none', color: '#64748b' }}>
            {param.label}
          </label>
          {param.type === 'text' || param.type === 'json' ? (
            <textarea
              className="form-textarea"
              placeholder={`Enter ${param.label.toLowerCase()}...`}
              value={values[param.key] || ''}
              onChange={(e) => handleChange(param.key, e.target.value)}
              rows={param.type === 'json' ? 3 : 2}
              style={{ fontFamily: param.type === 'json' ? "'JetBrains Mono', monospace" : 'inherit', fontSize: '12px' }}
            />
          ) : (
            <input
              type="text"
              className="form-input"
              placeholder={`Enter ${param.label.toLowerCase()}...`}
              value={values[param.key] || ''}
              onChange={(e) => handleChange(param.key, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
};
