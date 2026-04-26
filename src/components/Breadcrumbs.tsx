import { useNavigate } from 'react-router-dom';
import type { BreadcrumbItem } from '../types';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const navigate = useNavigate();

  if (items.length === 0) return null;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={item.path} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {i > 0 && <span className="breadcrumb-sep">›</span>}
            {isLast ? (
              <span className="breadcrumb-current">{item.label}</span>
            ) : (
              <button
                className="breadcrumb-link"
                onClick={() => navigate(item.path)}
                aria-label={`Go to ${item.label}`}
              >
                {item.label}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}
