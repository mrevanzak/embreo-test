'use client';

import { DialogClose } from '@radix-ui/react-dialog';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';

import { useMediaQuery } from '@/lib/hooks/use-media-query';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

type ResponsiveDialogProps = {
  trigger: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  id: string;
};

export function ResponsiveDialog({
  trigger,
  title,
  description,
  children,
  id,
}: ResponsiveDialogProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const open = searchParams.has(id);
  const onOpenChange = (value: boolean) => {
    if (!value) router.back();
    if (value) router.push(pathname + `?${id}`);
  };

  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline' className='flex-1'>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className='px-4'>{children}</div>
        <DrawerFooter className='pt-2'>
          <DrawerClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
