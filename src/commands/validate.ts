import { Flags } from '@oclif/core';

import Command from '../base';
import { SchemaValidationStatus, validate, validationFlags } from '../parser';
import { load } from '../models/SpecificationFile';
import { specWatcher } from '../globals';
import { watchFlag } from '../flags';

export default class Validate extends Command {
  static description = 'validate asyncapi file';

  static flags = {
    help: Flags.help({ char: 'h' }),
    watch: watchFlag(),
    ...validationFlags(),
  };

  static args = [
    { name: 'spec-file', description: 'spec path, url, or context-name', required: false },
  ];

  async run() {
    console.log("inside the run function");

    const { args, flags } = await this.parse(Validate); //NOSONAR
    console.log(flags);
    const filePath = args['spec-file'];
    const watchMode = flags.watch;

    const specFile = await load(filePath);
    if (watchMode) {
      specWatcher({ spec: specFile, handler: this, handlerName: 'validate' });
    }


    const response = await validate(this, specFile, flags);
    if (response === SchemaValidationStatus.Invalid) {
      this.exit(1);
    }
  }

}
