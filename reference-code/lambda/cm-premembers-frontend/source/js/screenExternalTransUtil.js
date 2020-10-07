import $ from 'jquery'
import trans from './trans.js'

trans.initI18Next().then(function() {
  $('[data-i18n]').each(function() {
    let keyI18n = $(this).data('i18n')
    localize($(this), keyI18n)
  })
})

function localize(ele, keyI18n) {
  if (keyI18n.indexOf(';') >= 0) {
    let keys = keyI18n.split(';')

    $.each(keys, function (m, key) {
      if (key !== '') {
        parse(ele, key)
      }
    })
  } else {
    parse(ele, keyI18n)
  }
}

function parse(ele, key) {
  if (key.length === 0) {
    return
  }

  let attr = 'text'

  if (key.indexOf('[') === 0) {
    let parts = key.split(']')
    key = parts[1]
    attr = parts[0].substr(1, parts[0].length - 1)
  }

  if (key.indexOf(';') === key.length - 1) {
    key = key.substr(0, key.length - 2)
  }

  if (attr === 'html') {
    ele.html(i18next.t(key))
  } else if (attr === 'text') {
    ele.text(i18next.t(key))
  } else if (attr === 'prepend') {
    ele.prepend(i18next.t(key))
  } else if (attr === 'append') {
    ele.append(i18next.t(key))
  } else {
    ele.attr(attr, i18next.t(key))
  }
}
