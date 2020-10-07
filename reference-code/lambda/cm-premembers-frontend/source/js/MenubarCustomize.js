import $ from 'jquery'
import Menubar from 'Menubar'

const $BODY = $('body')

export default class extends Menubar {
  unfold() {
    this.disableScroll()
    this.animate(function() {
      $BODY.addClass('site-menubar-unfold')
      this.folded = false
    }, function() {
      this.scrollable.enable()
      this.triggerResize()
    })
  }

  fold() {
    this.disableScroll()
    this.animate(function() {
      $BODY.addClass('site-menubar-fold')
      this.folded = true
    }, function() {
      this.scrollable.enable()
      this.triggerResize()

      // setting for display tooltip
      $(document).on('mouseenter', '.site-menubar-fold .site-menu-item', function() {
        $('.scrollable-container').width(500)
      })
      $(document).on('mouseleave', '.site-menubar-fold .site-menu-item', function() {
        $('.scrollable-container').width(50)
      })
      $(document).on('changed.site.menubar', function() {
        $('.site-menu-item.hover').trigger('mouseenter')
      })
    })
  }

  disableScroll() {
    this.scrollable.disable()
    this.hoverscroll.disable()
  }
}
