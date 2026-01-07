import React, { Component, ErrorInfo, ReactNode } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { translations } from '../constants';
import type { LanguageContextType } from '../contexts/LanguageContext';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

// FIX: Added an explicit `context` type declaration. For class components using `contextType`, this declaration is necessary
// to make TypeScript aware of `this.context`'s type and existence, resolving errors where both `this.context` and `this.props` were not found.
export class ErrorBoundary extends Component<Props, State> {
  static contextType = LanguageContext;
  // FIX: Added explicit context type.
  context!: React.ContextType<typeof LanguageContext>;

  // FIX: Explicitly declaring `props` makes it available to the type-checker in environments
  // where inherited properties from generic base classes might not be correctly inferred.
  public readonly props!: Props;

  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  // FIX: Added explicit return type ReactNode to the render method to resolve a type inference issue.
  public render(): ReactNode {
    if (this.state.hasError) {
      const { language } = this.context as LanguageContextType;
      const t = translations[language].errorBoundary;
      
      return (
        <div className="min-h-screen flex items-center justify-center text-center text-white p-4">
          <div className="card-base p-8 rounded-2xl max-w-lg">
             <div className="text-red-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
            <h1 className="text-3xl font-bold celestial-title mb-4">{t.title}</h1>
            <p className="text-gray-300 mb-6">{t.message}</p>
            <button
              onClick={this.handleRefresh}
              className="button-primary"
            >
              {t.refreshButton}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
