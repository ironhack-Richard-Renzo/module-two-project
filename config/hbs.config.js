const hbs = require('hbs');
const path = require('path');

hbs.registerPartials(path.join(__dirname, '../views/partials'));

/** Nav Helpers */
hbs.registerHelper('active', (currentPath, hint, options) => {
  const args = options.hash;
  if (args.exact) {
    return currentPath === hint ? 'active' : '';
  } else {
    return currentPath.includes(hint) ? 'active' : '';
  }
});

/** Form Helpers */
hbs.registerHelper('formError', (error) => {
  return error ? new hbs.SafeString(`<span class="invalid">${error}</span>`) : ''
});

/** Content Helpers */
hbs.registerHelper('limitChars', (maxChars, options) => {
  return options.fn().slice(0, maxChars) + '...';
})
