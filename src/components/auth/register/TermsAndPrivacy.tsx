
import React from 'react';

const TermsAndPrivacy = () => {
  return (
    <>
      <p className="text-xs text-facebook-gray">
        People who use our service may have uploaded your contact information to Shqipet.
        <a href="#" onClick={(e) => e.preventDefault()} className="fb-link"> Learn more</a>.
      </p>
      
      <p className="text-xs text-facebook-gray">
        By clicking Sign Up, you agree to our
        <a href="#" onClick={(e) => e.preventDefault()} className="fb-link"> Terms</a>,
        <a href="#" onClick={(e) => e.preventDefault()} className="fb-link"> Privacy Policy</a> and
        <a href="#" onClick={(e) => e.preventDefault()} className="fb-link"> Cookies Policy</a>.
      </p>
    </>
  );
};

export default TermsAndPrivacy;
