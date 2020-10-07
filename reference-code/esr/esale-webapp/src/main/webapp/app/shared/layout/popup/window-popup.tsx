import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

function copyStyles(sourceDoc: any, targetDoc: any) {
  const links = document.head.getElementsByTagName('link');
  for(const link in links){
    // eslint-disable-next-line no-prototype-builtins
    if(links.hasOwnProperty(link)){
        const l = links[link];
        if(l.rel === 'stylesheet')  {
          const newStyleEl = targetDoc.createElement('link');
          newStyleEl.href = l.href;
          newStyleEl.rel = 'stylesheet';
          targetDoc.head.appendChild(newStyleEl);
        }
    }
  }
  const baseUrl = window.location.origin.toString();
  Array.from(sourceDoc.styleSheets).forEach((styleSheet, i) => {
    if ((styleSheet as CSSStyleSheet).cssRules) { // true for inline styles
      const newStyleEl = targetDoc.createElement('style');
      Array.from((styleSheet as CSSStyleSheet).cssRules).forEach((cssRule, idx) => {
        if (cssRule.cssText.includes("/content/images/")) {
          newStyleEl.appendChild(targetDoc.createTextNode(cssRule.cssText.replace("/content/images/", baseUrl + "/content/images/")));
        } else if (cssRule.cssText.includes("/content/fonts/")) {
          newStyleEl.appendChild(targetDoc.createTextNode(cssRule.cssText.replace("/content/fonts/", baseUrl + "/content/fonts/")));
        } else {
          newStyleEl.appendChild(targetDoc.createTextNode(cssRule.cssText));
        }
      });
      targetDoc.head.appendChild(newStyleEl);
    }
  });
}

function copyJavaScript(sourceDoc: any, targetDoc: any) {
  const scripts = document.getElementsByTagName('script');
  for(const sc in scripts){
    // eslint-disable-next-line no-prototype-builtins
    if(scripts.hasOwnProperty(sc)){
        const s = scripts[sc];
        const newStyleEl = targetDoc.createElement('script');
        newStyleEl.src = s.src;
        newStyleEl.type = s.type;
        newStyleEl.text = s.text;
        targetDoc.head.appendChild(newStyleEl);
    }
  }
}

export class WindowPopup extends React.PureComponent<any, {}> {
  containerEl: any;
  externalWindow: any;
  constructor(props) {
    super(props);
    this.containerEl = null;
    this.externalWindow = null;
  }

  componentDidMount() {
    this.renderPopup();
  }

  renderPopup() {
    if (this.containerEl) {
      return;
    }
    const height = screen.height * 0.6;
    const width = screen.width * 0.6;
    const left = screen.width * 0.2;
    const top = screen.height * 0.2;

    const style = `width=${width},height=${height},left=${left},top=${top}`;
    // this.externalWindow = window.open('', '', 'width=600,height=400,left=200,top=200');
    this.externalWindow = window.open('', '', style.toString());

    this.containerEl = this.externalWindow.document.createElement('div');
    if (this.containerEl) {
      this.containerEl.className = "wrap-container";
    }
    this.externalWindow.document.body.appendChild(this.containerEl);


    this.externalWindow.document.title = '';
    copyStyles(document, this.externalWindow.document);
    // copyJavaScript(document, this.externalWindow.document);

    // update the state in the parent component if the user closes the
    // new window
    this.externalWindow.addEventListener('beforeunload', (e) => {
      this.props.closeWindowPortal();
    });
  }

  componentWillUnmount() {
    // This will fire when this.state.showWindowPortal in the parent component becomes false
    // So we tidy up by just closing the window
    if (this.externalWindow) {
      this.externalWindow.close();
    }
  }

  render() {
    // The first render occurs before componentDidMount (where we open
    // the new window), so our container may be null, in this case
    // render nothing.
    if (!this.containerEl) {
      this.renderPopup()
      // return null;
    }
    // Append props.children to the container <div> in the new window
    return ReactDOM.createPortal(this.props.children, this.containerEl);
  }
}
