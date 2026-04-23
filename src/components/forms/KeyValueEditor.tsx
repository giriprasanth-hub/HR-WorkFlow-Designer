import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface KVPair {
  key: string;
  value: string;
}

interface KeyValueEditorProps {
  label?: string;
  pairs: KVPair[];
  onChange: (pairs: KVPair[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}

/**
 * A reusable key-value pair editor for metadata and customFields.
 */
export const KeyValueEditor: React.FC<KeyValueEditorProps> = ({
  label,
  pairs,
  onChange,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
}) => {
  const handleChange = (index: number, field: 'key' | 'value', val: string) => {
    const updated = pairs.map((p, i) => (i === index ? { ...p, [field]: val } : p));
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...pairs, { key: '', value: '' }]);
  };

  const handleRemove = (index: number) => {
    onChange(pairs.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="form-label">{label}</span>
      )}
      {pairs.length > 0 && (
        <div className="flex flex-col gap-2">
          {pairs.map((pair, i) => (
            <div key={i} className="kv-editor__row">
              <input
                value={pair.key}
                onChange={(e) => handleChange(i, 'key', e.target.value)}
                placeholder={keyPlaceholder}
                className="form-input"
              />
              <input
                value={pair.value}
                onChange={(e) => handleChange(i, 'value', e.target.value)}
                placeholder={valuePlaceholder}
                className="form-input"
              />
              <button
                type="button"
                className="kv-editor__remove-btn"
                onClick={() => handleRemove(i)}
                title="Remove"
              >
                <Trash2 size={11} />
              </button>
            </div>
          ))}
        </div>
      )}
      <button type="button" className="kv-editor__add-btn" onClick={handleAdd}>
        <Plus size={12} />
        Add {label || 'Field'}
      </button>
    </div>
  );
};
