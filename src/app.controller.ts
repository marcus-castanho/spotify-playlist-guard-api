import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Public } from './auth/decorators/public.decorator';

@Public()
@Controller()
export class AppController {
  constructor() {
    return;
  }

  @Get()
  redirectRootToDocs(@Req() req: Request, @Res() res: Response) {
    return res.redirect('/api');
  }
}
