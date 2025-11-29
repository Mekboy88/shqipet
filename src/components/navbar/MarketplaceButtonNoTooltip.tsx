
import React from "react";
import NavButtonNoTooltip from "./NavButtonNoTooltip";

interface MarketplaceButtonProps {
  active?: boolean;
}

const MarketplaceButtonNoTooltip = React.memo(({ active = false }: MarketplaceButtonProps) => {
  // Create a gradient string with brick-red and terracotta orange
  const marketplaceGradient = 'linear-gradient(to right, #B22222, #E2725B)';

  return (
    <NavButtonNoTooltip 
      to="/marketplace" 
      active={active}
      customActiveColor={active ? marketplaceGradient : undefined}
    >
      <svg 
        viewBox="0 0 512 512" 
        version="1.1" 
        xmlSpace="preserve" 
        xmlns="http://www.w3.org/2000/svg" 
        xmlnsXlink="http://www.w3.org/1999/xlink" 
        fill="#000000"
        className="w-10 h-10"
        style={{
          transition: 'none',
          transform: 'translateZ(0)'
        }}
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <g>
            <g>
              <g>
                <g>
                  <g>
                    <rect className="st6" height="326.4" width="436.1" x="38" y="130.7" style={{fill:"#DEF6FC"}}></rect>
                    <rect className="st8" height="326.4" width="25.2" x="38" y="130.7" style={{fill:"#FFFFFF"}}></rect>
                    <g>
                      <path className="st14" d="M76.4,130.7H4.6l35.8-94.9c5.2-13.9,18.5-23,33.3-23h34.5L76.4,130.7z" style={{fill:"#FF5741"}}></path>
                      <path className="st10" d="M98.9,12.7H73.7c-14.8,0-28.1,9.2-33.3,23L4.6,130.7h25.2l35.8-94.9C70.8,21.9,84.1,12.7,98.9,12.7z" style={{fill:"#FF908A"}}></path>
                      <polygon className="st14" points="148.2,130.7 76.4,130.7 108.2,12.7 167.3,12.7" style={{fill:"#FF5741"}}></polygon>
                      <polygon className="st14" points="220.1,130.7 148.2,130.7 167.3,12.7 226.4,12.7" style={{fill:"#FF5741"}}></polygon>
                      <polygon className="st14" points="291.9,130.7 220.1,130.7 226.4,12.7 285.6,12.7" style={{fill:"#FF5741"}}></polygon>
                      <polygon className="st14" points="363.8,130.7 291.9,130.7 285.6,12.7 344.7,12.7" style={{fill:"#FF5741"}}></polygon>
                      <polygon className="st14" points="435.6,130.7 363.8,130.7 344.7,12.7 403.8,12.7" style={{fill:"#FF5741"}}></polygon>
                      <path className="st14" d="M507.4,130.7h-71.8l-31.8-118h34.5c14.8,0,28.1,9.2,33.3,23L507.4,130.7z" style={{fill:"#FF5741"}}></path>
                    </g>
                    <g>
                      <path className="st22" d="M40.5,199.8L40.5,199.8c-19.8,0-35.9-16.1-35.9-35.9v-33.2h71.8v33.2C76.4,183.7,60.3,199.8,40.5,199.8z" style={{fill:"#F24133"}}></path>
                      <path className="st10" d="M29.8,163.9v-33.2H4.6v33.2c0,19.8,16.1,35.9,35.9,35.9h0c4.4,0,8.7-0.8,12.6-2.3C39.5,192.4,29.8,179.3,29.8,163.9z" style={{fill:"#FF908A"}}></path>
                      <path className="st22" d="M112.3,199.8L112.3,199.8c-19.8,0-35.9-16.1-35.9-35.9v-33.2h71.8v33.2C148.2,183.7,132.2,199.8,112.3,199.8z" style={{fill:"#F24133"}}></path>
                      <path className="st22" d="M184.2,199.8L184.2,199.8c-19.8,0-35.9-16.1-35.9-35.9v-33.2h71.8v33.2C220.1,183.7,204,199.8,184.2,199.8z" style={{fill:"#F24133"}}></path>
                      <path className="st22" d="M256,199.8L256,199.8c-19.8,0-35.9-16.1-35.9-35.9v-33.2h71.8v33.2C291.9,183.7,275.8,199.8,256,199.8z" style={{fill:"#F24133"}}></path>
                      <path className="st22" d="M327.8,199.8L327.8,199.8c-19.8,0-35.9-16.1-35.9-35.9v-33.2h71.8v33.2C363.8,183.7,347.7,199.8,327.8,199.8z" style={{fill:"#F24133"}}></path>
                      <path className="st22" d="M399.7,199.8L399.7,199.8c-19.8,0-35.9-16.1-35.9-35.9v-33.2h71.8v33.2C435.6,183.7,419.5,199.8,399.7,199.8z" style={{fill:"#F24133"}}></path>
                      <path className="st22" d="M471.5,199.8L471.5,199.8c-19.8,0-35.9-16.1-35.9-35.9v-33.2h71.8v33.2C507.4,183.7,491.4,199.8,471.5,199.8z" style={{fill:"#F24133"}}></path>
                    </g>
                  </g>
                </g>
                <path className="st15" d="M193.9,468.5H75.5V259.8c0-4.7,3.8-8.5,8.5-8.5h101.4c4.7,0,8.5,3.8,8.5,8.5V468.5z" style={{fill:"#133260"}}></path>
                <path className="st16" d="M110.1,251.3H84c-4.7,0-8.5,3.8-8.5,8.5v208.7h26.1V259.8C101.6,255.1,105.4,251.3,110.1,251.3z" style={{fill:"#5E7296"}}></path>
                <path className="st20" d="M420.2,371.2h-180c-7.7,0-13.9-6.2-13.9-13.9v-92.1c0-7.7,6.2-13.9,13.9-13.9h180c7.7,0,13.9,6.2,13.9,13.9v92.1C434.1,365,427.9,371.2,420.2,371.2z" style={{fill:"#9BC5FF"}}></path>
                <path className="st21" d="M248.6,357.3v-92.1c0-7.7,6.2-13.9,13.9-13.9h-25.2c-7.7,0-13.9,6.2-13.9,13.9v92.1c0,7.7,6.2,13.9,13.9,13.9h25.2C254.8,371.2,248.6,365,248.6,357.3z" style={{fill:"#B8D8FF"}}></path>
                <path className="st14" d="M483.2,499.3H28.8c-13.4,0-24.2-10.8-24.2-24.2v0c0-13.4,10.8-24.2,24.2-24.2h454.5c13.4,0,24.2,10.8,24.2,24.2v0C507.4,488.5,496.6,499.3,483.2,499.3z" style={{fill:"#FF5741"}}></path>
                <path className="st10" d="M28.8,450.9c-13.4,0-24.2,10.8-24.2,24.2v0c0,13.4,10.8,24.2,24.2,24.2h1v-48.4H28.8z" style={{fill:"#FF908A"}}></path>
              </g>
              <path className="st6" d="M168.4,329H101c-2.6,0-4.6-2.1-4.6-4.6v-46.9c0-2.6,2.1-4.6,4.6-4.6h67.4c2.6,0,4.6,2.1,4.6,4.6v46.9C173.1,326.9,171,329,168.4,329z" style={{fill:"#DEF6FC"}}></path>
            </g>
          </g>
        </g>
      </svg>
    </NavButtonNoTooltip>
  );
});

MarketplaceButtonNoTooltip.displayName = 'MarketplaceButtonNoTooltip';

export default MarketplaceButtonNoTooltip;
