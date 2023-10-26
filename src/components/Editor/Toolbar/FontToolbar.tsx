'use client';

import React, { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { COMMAND_PRIORITY_EDITOR, FORMAT_TEXT_COMMAND, createCommand } from 'lexical';
import { mergeRegister } from '@lexical/utils';
import Toolbar from '../Lexical/Component/ToolbarUI/Toolbar';
import type { CleanupCommand } from '../Lexical/LexicalEditor';

export type FontToolbarNames = 'Bold' | 'Italic';

export type IsBoldCommandPayload = boolean;
export type IsItalicCommandPayload = boolean;

export const IS_BOLD_COMMAND = createCommand<IsBoldCommandPayload>('isActiveBold');
export const IS_ITALIC_COMMAND = createCommand<IsItalicCommandPayload>('isItalic');

export function FontToolbar() {
  const [editor] = useLexicalComposerContext();

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  const bold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  };

  const italic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  };

  useEffect(() => {
    let cleanupMergedFontTollbarCommand: CleanupCommand = null;

    if (editor.isEditable()) {
      cleanupMergedFontTollbarCommand = mergeRegister(
        editor.registerCommand<IsBoldCommandPayload>(
          IS_BOLD_COMMAND,
          (payload, editor) => {
            setIsBold(payload);

            return false;
          },
          COMMAND_PRIORITY_EDITOR,
        ),
        editor.registerCommand<IsItalicCommandPayload>(
          IS_ITALIC_COMMAND,
          (payload, editor) => {
            setIsItalic(payload);

            return false;
          },
          COMMAND_PRIORITY_EDITOR,
        ),
      );
    }

    return () => {
      if (cleanupMergedFontTollbarCommand) {
        cleanupMergedFontTollbarCommand();
      }
    };
  }, [editor]); /* eslint-disable-line */

  return editor.isEditable() ? (
    <Toolbar.GroupWrapper>
      {/* 볼드, 이텔릭체 */}
      <Toolbar.Button active={isBold} icon={'Bold'} title={`굵기 ${isBold ? '해제' : '적용'}`} onClick={bold} />
      <Toolbar.Button
        active={isItalic}
        icon={'Italic'}
        title={`기울이기 ${isItalic ? '해제' : '적용'}`}
        onClick={italic}
      />
    </Toolbar.GroupWrapper>
  ) : null;
}
