import React from 'react';

import Dialog from './dialog';
import Button from './button';

export default function Confirm(props) {
  const { open, onClose, title, children, onConfirm } = props;
  if (!open) {
    return <></>;
  }

  return (
    <Dialog open={open} onClose={onClose}>

      <h2 className="text-xl font-semibold">{title}</h2>

      <div className="py-5">{children}</div>

      <div className="flex justify-end">

        <div className="p-1">
          <Button
            onClick={() => onClose()}
            className="bg-red-600 hover:bg-red-400"
          >
            Não
          </Button>
        </div>

        <div className="p-1">
          <Button
            onClick={() => {
              onClose();
              onConfirm();
            }}
            className="bg-emerald-600 hover:bg-emerald-400"
          >
            Sim
          </Button>
        </div>

      </div>

    </Dialog>
  );
}