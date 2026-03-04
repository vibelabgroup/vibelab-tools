import React from 'react';

export const Privacy: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-display text-slate-900 dark:text-white mb-8">Privacy Policy</h1>
        <div className="prose prose-lg prose-slate dark:prose-invert">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>At VibeLab Tools, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our website.</p>
          
          <h2>Information We Collect</h2>
          <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
          <ul>
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.</li>
            <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
          </ul>

          <h2>Use of Your Information</h2>
          <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
          <ul>
            <li>Create and manage your account.</li>
            <li>Compile anonymous statistical data and analysis for use internally or with third parties.</li>
            <li>Email you regarding your account or order.</li>
            <li>Enable user-to-user communications.</li>
            <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
          </ul>

          <h2>Contact Us</h2>
          <p>If you have questions or comments about this Privacy Policy, please contact us at support@vibelabtools.com.</p>
        </div>
      </div>
    </div>
  );
};
