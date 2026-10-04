export function getToggleAction(level) {
  switch (level) {
    case 'closed':
      return 'open';
    case 'sub':
      return 'back';
    case 'root':
      return 'close';
    default:
      return null;
  }
}
