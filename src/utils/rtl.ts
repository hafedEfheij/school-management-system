/**
 * Utility functions for RTL (Right-to-Left) support
 */

/**
 * Returns the appropriate margin class based on direction and language
 * @param direction The direction ('left' or 'right')
 * @param size The size of the margin (1-12)
 * @param isRtl Whether the current language is RTL
 */
export function getMarginClass(direction: 'left' | 'right', size: number, isRtl: boolean): string {
  if (direction === 'left') {
    return isRtl ? `ml-${size}` : `mr-${size}`;
  } else {
    return isRtl ? `mr-${size}` : `ml-${size}`;
  }
}

/**
 * Returns the appropriate padding class based on direction and language
 * @param direction The direction ('left' or 'right')
 * @param size The size of the padding (1-12)
 * @param isRtl Whether the current language is RTL
 */
export function getPaddingClass(direction: 'left' | 'right', size: number, isRtl: boolean): string {
  if (direction === 'left') {
    return isRtl ? `pl-${size}` : `pr-${size}`;
  } else {
    return isRtl ? `pr-${size}` : `pl-${size}`;
  }
}

/**
 * Returns the appropriate position class based on position and language
 * @param position The position ('left' or 'right')
 * @param size The size value (0-12)
 * @param isRtl Whether the current language is RTL
 */
export function getPositionClass(position: 'left' | 'right', size: number, isRtl: boolean): string {
  if (position === 'left') {
    return isRtl ? `right-${size}` : `left-${size}`;
  } else {
    return isRtl ? `left-${size}` : `right-${size}`;
  }
}

/**
 * Returns the appropriate text alignment class based on language
 * @param isRtl Whether the current language is RTL
 */
export function getTextAlignClass(isRtl: boolean): string {
  return isRtl ? 'text-right' : 'text-left';
}

/**
 * Returns the appropriate flex direction class based on language
 * @param isRtl Whether the current language is RTL
 */
export function getFlexDirectionClass(isRtl: boolean): string {
  return isRtl ? 'flex-row-reverse' : 'flex-row';
}

/**
 * Returns the appropriate border class based on direction and language
 * @param direction The direction ('left' or 'right')
 * @param isRtl Whether the current language is RTL
 */
export function getBorderClass(direction: 'left' | 'right', isRtl: boolean): string {
  if (direction === 'left') {
    return isRtl ? 'border-l' : 'border-r';
  } else {
    return isRtl ? 'border-r' : 'border-l';
  }
}

/**
 * Returns the appropriate rounded corner class based on direction and language
 * @param corner The corner ('top-left', 'top-right', 'bottom-left', 'bottom-right')
 * @param isRtl Whether the current language is RTL
 */
export function getRoundedClass(corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right', isRtl: boolean): string {
  const cornerMap = {
    'top-left': isRtl ? 'rounded-tr' : 'rounded-tl',
    'top-right': isRtl ? 'rounded-tl' : 'rounded-tr',
    'bottom-left': isRtl ? 'rounded-br' : 'rounded-bl',
    'bottom-right': isRtl ? 'rounded-bl' : 'rounded-br',
  };
  
  return cornerMap[corner];
}

/**
 * Returns a set of RTL-aware utility functions
 * @param isRtl Whether the current language is RTL
 */
export function createRtlUtils(isRtl: boolean) {
  return {
    margin: (direction: 'left' | 'right', size: number) => getMarginClass(direction, size, isRtl),
    padding: (direction: 'left' | 'right', size: number) => getPaddingClass(direction, size, isRtl),
    position: (position: 'left' | 'right', size: number) => getPositionClass(position, size, isRtl),
    textAlign: () => getTextAlignClass(isRtl),
    flexDirection: () => getFlexDirectionClass(isRtl),
    border: (direction: 'left' | 'right') => getBorderClass(direction, isRtl),
    rounded: (corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => getRoundedClass(corner, isRtl),
    dir: isRtl ? 'rtl' : 'ltr',
  };
}
