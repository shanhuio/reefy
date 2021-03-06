import ConfigStore from './ConfigStore';

import CursorSelection from '../types/CursorSelection';


let _lines = ['hello', 'world'];

let FileStore = {

  getLines: function() {
    return _lines;
  },

  getXYPositionByRC: function(row: number, col: number) {
    row = Math.min(_lines.length - 1, row);
    col = Math.min(_lines[row].length, col);
    return {
      x: ConfigStore.getLineWidth(_lines[row].slice(0, col)),
      y: ConfigStore.getConfig().lineHeight * row,
    };
  },

  getRCPositionByXY: function(x: number, y: number) {
    let row = Math.floor(y / ConfigStore.getConfig().lineHeight);
    if (row >= _lines.length) {
      row = _lines.length - 1;
      return {row: row, col: _lines[row].length};
    }

    let col = 0;
    let line = _lines[row];
    let width = ConfigStore.getLineWidth(line);
    if (x > width) {
      col = line.length;
    } else {
      let minDist = x;
      for (let i = 1; i < line.length; ++i) {
        let p = ConfigStore.getLineWidth(line.substring(0, i));
        let d = Math.abs(x - p);
        if (d < minDist) {
          minDist = d;
          col = i;
        }
      }
    }
    return {row: row, col: col};
  },

  insert: function(row: number, col: number, text: string) {
    let segments = text.split('\n');
    let nseg = segments.length;
    let line = _lines[row];
    // Inserts text in a single line.
    if (nseg == 1) {
      _lines[row] = line.slice(0, col) + segments[0] + line.slice(col);
      return {
        row: row,
        col: col + segments[0].length,
      };
    }
    // Inserts multiple lines.
    _lines.splice(row, 1,
        line.slice(0, col) + segments[0],
        ...segments.slice(1, nseg - 1),
        segments[nseg - 1] + line.slice(col));
    return {
      row: row + nseg - 1,
      col: segments[nseg - 1].length,
    };
  },

  remove: function(row: number, col: number) {
    let line = _lines[row];
    if (col < 0) {
      _lines.splice(row - 1, 2, (_lines[row - 1] || '') + line);
    } else if (col >= line.length) {
      _lines.splice(row, 2, line + (_lines[row + 1] || ''));
    } else {
      _lines[row] = line.slice(0, col) + line.slice(col + 1);
    }
  },

  removeSelection: function(sel: CursorSelection) {
    if (sel) {
      let beginLine = _lines[sel.begin.row];
      let endLine = _lines[sel.end.row];
      _lines.splice(
          sel.begin.row,
          sel.end.row - sel.begin.row + 1,
          beginLine.slice(0, sel.begin.col) + endLine.slice(sel.end.col));
    }
  },

};

export default FileStore;
