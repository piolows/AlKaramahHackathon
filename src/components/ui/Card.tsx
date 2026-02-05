import { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronRight, LucideIcon } from 'lucide-react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ children, className = '', hover = false, padding = 'md' }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl shadow-sm border border-gray-100
        ${hover ? 'hover:shadow-md hover:border-indigo-200 transition-all' : ''}
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface LinkCardProps extends CardProps {
  href: string;
}

export function LinkCard({ href, children, className = '', padding = 'md' }: LinkCardProps) {
  return (
    <Link
      href={href}
      className={`
        block bg-white rounded-2xl shadow-sm border border-gray-100
        hover:shadow-md hover:border-indigo-200 transition-all group
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {children}
    </Link>
  );
}

interface CardHeaderProps {
  icon?: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  title: string;
  showArrow?: boolean;
  children?: ReactNode; // For badges, etc.
}

export function CardHeader({
  icon: Icon,
  iconBgColor = 'bg-indigo-100',
  iconColor = 'text-indigo-600',
  title,
  showArrow = false,
  children,
}: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={`w-10 h-10 ${iconBgColor} rounded-xl flex items-center justify-center group-hover:opacity-90 transition-colors`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>
      </div>
      <div className="flex items-center gap-2">
        {children}
        {showArrow && (
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
        )}
      </div>
    </div>
  );
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: LucideIcon;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="text-center py-12">
      <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      {action && (
        action.href ? (
          <Link
            href={action.href}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {action.icon && <action.icon className="h-4 w-4" />}
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {action.icon && <action.icon className="h-4 w-4" />}
            {action.label}
          </button>
        )
      )}
    </Card>
  );
}
