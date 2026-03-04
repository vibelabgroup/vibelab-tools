import React from 'react';

export const Terms: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-display text-slate-900 dark:text-white mb-8">Terms of Service</h1>
        <div className="prose prose-lg prose-slate dark:prose-invert">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the VibeLab Tools website (the "Service") operated by VibeLab Tools ("us", "we", or "our").</p>
          
          <h2>1. Terms</h2>
          <p>By accessing the website at VibeLab Tools, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>

          <h2>2. Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials (information or software) on VibeLab Tools' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
          <ul>
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
            <li>attempt to decompile or reverse engineer any software contained on VibeLab Tools' website;</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>

          <h2>3. Disclaimer</h2>
          <p>The materials on VibeLab Tools' website are provided on an 'as is' basis. VibeLab Tools makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

          <h2>4. Limitations</h2>
          <p>In no event shall VibeLab Tools or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on VibeLab Tools' website, even if VibeLab Tools or a VibeLab Tools authorized representative has been notified orally or in writing of the possibility of such damage.</p>

          <h2>5. Accuracy of materials</h2>
          <p>The materials appearing on VibeLab Tools' website could include technical, typographical, or photographic errors. VibeLab Tools does not warrant that any of the materials on its website are accurate, complete or current. VibeLab Tools may make changes to the materials contained on its website at any time without notice. However VibeLab Tools does not make any commitment to update the materials.</p>
        </div>
      </div>
    </div>
  );
};
