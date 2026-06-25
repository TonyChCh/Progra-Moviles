import { useCallback, useState } from 'react';

export interface ModalController {
  isVisible: boolean;
  open: () => void;
  close: () => void;
}

export function useModal(): ModalController {
  const [isVisible, setIsVisible] = useState(false);

  const open = useCallback(() => setIsVisible(true), []);
  const close = useCallback(() => setIsVisible(false), []);

  return { isVisible, open, close };
}
