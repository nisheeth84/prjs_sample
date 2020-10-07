import React from 'react';

interface IIconLoadingProps {
  isLoading: boolean,
}
const IconLoading = (props: IIconLoadingProps) => {
  return (
    <>
      {props.isLoading &&
        <li>
          <p className="sk-fading-circle margin-auto style-2" 
            ref={element => { 
              if (element) element.style.setProperty('display', 'block', 'important');
            }}
          >
            <span className="sk-circle1 sk-circle"></span>
            <span className="sk-circle2 sk-circle"></span>
            <span className="sk-circle3 sk-circle"></span>
            <span className="sk-circle4 sk-circle"></span>
            <span className="sk-circle5 sk-circle"></span>
            <span className="sk-circle6 sk-circle"></span>
            <span className="sk-circle7 sk-circle"></span>
            <span className="sk-circle8 sk-circle"></span>
            <span className="sk-circle9 sk-circle"></span>
            <span className="sk-circle10 sk-circle"></span>
            <span className="sk-circle11 sk-circle"></span>
            <span className="sk-circle12 sk-circle"></span>
          </p>
        </li>
      }
    </>
  )
}
export default IconLoading;