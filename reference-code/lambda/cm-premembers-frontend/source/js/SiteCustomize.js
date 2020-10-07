import $ from 'jquery'
import Site from 'Site'
import MenubarCustomize from './MenubarCustomize.js'
import CommonUtils from './commonUtils.js'

class SiteCustomize extends Site {
  willProcess() {
    this.initializePluginAPIs()
    this.initializePlugins()
  }

  processed() {
    this.polyfillIEWidth()
    this.initBootstrap()

    this.setupMenubar()
  }

  setupMenubar() {
    $(document).on('click', '[data-toggle="menubar"]', () => {
      let type = this.getState('menubarType')
      switch (type) {
        case 'fold':
          type = 'unfold'
          CommonUtils.setItemToLocalStorage('responsiveMenu', false)
          break
        case 'unfold':
          type = 'fold'
          CommonUtils.setItemToLocalStorage('responsiveMenu', true)
          break
        // no default
      }

      this.setState('menubarType', type)
      return false
    })

    Breakpoints.on('change', () => {
      this.setState('menubarType', this._getDefaultMeunbarType())
    })
  }

  getDefaultChildren() {
    let menubar = new MenubarCustomize({
      $el: $('.site-menubar')
    })
    let children = [menubar]
    return children
  }

  _getDefaultMeunbarType() {
    $.asHoverScroll.setDefaults({
      pointerScroll: false
    })

    if (this.getCurrentBreakpoint() == 'xs') {
      return 'hide'
    }

    let responsiveMenu = CommonUtils.getItemFromLocalStorage('responsiveMenu')
    if (responsiveMenu == 'true') {
      return 'fold'
    }

    return 'unfold'
  }
}

function run() {
  let site = new SiteCustomize()
  site.run()
}

function startLoading() {
  let site = new SiteCustomize()
  site.startLoading()
}

export default SiteCustomize
export {
  SiteCustomize,
  run,
  startLoading
}
