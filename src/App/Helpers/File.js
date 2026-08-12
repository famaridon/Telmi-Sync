const
  {pathToFileURL} = window.require('url'),

  // A scheme is two or more characters, so a Windows drive letter ("C:/...")
  // is not mistaken for one.
  hasScheme = (str) => /^[a-z][a-z0-9+.-]+:/i.test(str),

  // Covers reach the renderer either as an absolute filesystem path (local
  // stories and music) or as an http(s) URL (stores and RSS thumbnails). Only
  // the former needs a scheme: a bare path in an <img src> is resolved against
  // the page origin, which works in production, where the renderer is loaded
  // from file://, but not in dev, where it is served from localhost:3000 and
  // the dev server answers with index.html.
  imagePathToSrc = (filePath) =>
    typeof filePath !== 'string' || filePath === '' || hasScheme(filePath)
      ? filePath
      : pathToFileURL(filePath).href

export {imagePathToSrc}
