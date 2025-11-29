
import React from 'react';
import { Shield } from 'lucide-react';

const CookiesExplanation = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        <div className="mt-0.5">
          <Shield className="h-5 w-5 text-gray-500" />
        </div>
        <div>
          <p className="font-medium text-gray-900">Essential cookies</p>
          <p className="text-gray-700 text-sm">
            These cookies are necessary to enable core functionality and security, 
            making Shqipet products work correctly.
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <div className="mt-0.5">
          <Shield className="h-5 w-5 text-gray-500" />
        </div>
        <div>
          <p className="font-medium text-gray-900">Cookies on other apps and websites</p>
          <p className="text-gray-700 text-sm">
            Companies outside Shqipet may use our cookies and similar technologies, 
            like the Shqipet pixel or our social plugins, on their own websites and apps 
            to show you personalized content and ads. These cookies are optional.
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <div className="mt-0.5">
          <Shield className="h-5 w-5 text-gray-500" />
        </div>
        <div>
          <p className="font-medium text-gray-900">Cookies from other companies</p>
          <p className="text-gray-700 text-sm">
            We use these cookies to show you personalized content and ads off Shqipet products 
            and to provide enhanced features such as maps, videos, and payment services. 
            These cookies are optional.
          </p>
        </div>
      </div>

      <p className="text-gray-700 pt-2">
        You have control over the optional cookies that we use. Learn more about cookies 
        and how we use them in our{" "}
        <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline">Cookies Policy</a>.
      </p>
    </div>
  );
};

export default CookiesExplanation;
