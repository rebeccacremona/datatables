# A Harbard Library OSC Datatable
Built using SpryMedia's impressive [DataTables jQuery plugin](https://www.datatables.net).

[See it in action!](http://curlsandsuch.com/datatable/)

## Homespun features:
- Browser history updates automatically when you change the state of the table (searching, filtering, sorting), so your browser’s “back” button works as expected.
- Pass in search, filter, and sort settings via URL params.
- Toggleable "basic" and "advanced" views keep the page uncluttered while providing extra features to power users.
- A global boolean search field; column filters can be boolean or regex.
- In config.php, specify data locations: select columns from sqlite databases, tsv files, and/or (pre-formatted) json data. The app will combines them into a single data object for DataTables to use.
- Editable columns, using html5's contenteditable attribute.
- Editable tag lists that look like tags
- TSV export using php instead of Flash.

### Still to do:
Implementation:
- as a DataTables plugin, rather than js after rendering.

## a11y:
- Keyboard focus explicitly set on table redraw
- "Children row" toggles can be focused on and toggled using the keyboard
- Paging: move between paging buttons with one tab, instead of two (formerly one invisible focus on li element, one visible focus on anchor element.
- Screenreader friendly navigation, first pass. Added navigation and button roles to table pagination controls, and added SR-only context text(reads "Page 1 button, Page 2 button, You are currently on Page 3," instead of "list: 1,2,3..." Made ellpses aria-hidden. 

### Still to do:
#### Screenreader friendly, second pass: 
- add "scope" to column headers, possibly add aria role columnheader
- Set focus on table, not table caption, on redraw, to encourage reading of caption.
- Incorporate aria-live and aria-busy as appropriate
- Remove redundant aria-labels from non-sorting column headers.
- Investigate why the table cannot always be entered by VoiceOver, why the skip-to-table-nav button is currently "dimmed", why the column sorts cannot be triggered via VO-space in Chrome, and other anomalies.

####Keyboard friendly, second pass:
- replace the complex toggle switches with built-in Bootstrap solution, or replace with plain radio buttons

 
