import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto';

import * as fs from 'fs';
import * as limdu from 'limdu';
import * as spamfilter from 'spam-filter';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getTrainBatch() {
    return await new Promise((resolve,reject) => {
      const trainBatch = [];
      const csv = require('csv-parser');
      const inputFilePath = './files/train.csv';
      fs.createReadStream(inputFilePath)
        .pipe(csv())
        .on('data', function(data){
          const isSpam = data.class === "1" ? 'bad' : 'good'; 
          trainBatch.push({input:data.comment, output:isSpam});
      }).on('end', function(){
        resolve(trainBatch);
      }); 

    });
  }

  async getModel(){
    return new Promise((resolve,reject) => {
      const spamFilter = require(`spam-filter/naiveBayes`);
      spamFilter.generate();
      const csv = require('csv-parser');
      const inputFilePath = './files/train.csv';
      fs.createReadStream(inputFilePath)
        .pipe(csv())
        .on('data', function(data){
          const isSpam = data.class === "1" ? 'bad' : 'good'; 
          spamFilter.train(data.comment, isSpam);
      }).on('end', function(){
        resolve(spamFilter);
      }); 
    });
  }

  async trainModel() {

    const spamFilter: any = await this.getModel();

    await this.saveModelToFile(spamFilter);
    //await this.testModel(spamFilter);
    await this.saveModelToFile(spamFilter);

    //fs.writeFileSync('./model/naiveBayes.js', `module.exports = ${JSON.stringify(spamFilter)}`);
    
  }
  async createComment(comment: CreateCommentDto): Promise<string> {
    

    const filter = null;

    const result = filter.isSpam(comment.text);
    console.log(comment.text);
    console.log(result);
    console.log(filter.classify(comment.text));

    return result;
  }

  async testModel(model){
    console.log("Check my channel, please!", model.classify("Check my channel, please!"));
    console.log("subscribe to my channel", model.classify("subscribe to my channel"));
    console.log("just for test I have to say murdev.com", model.classify("just for test I have to say murdev.com"));
    console.log("fuck fuck fuck fuck", model.classify("fuck fuck fuck fuck"));
    console.log("just for test I have to say test.com", model.classify("just for test I have to say test.com"));
    console.log(" test.com", model.classify(" test.com"));      
    console.log("Oh i like this song so much!!!!",model.classify("Oh i like this song so much!!!!"));      
    console.log("Check out this link!",model.classify("Check out this link!"));
    console.log("Check out this link www.com.test",model.classify("Check out this link www.com.test")); 
    console.log("Hi everbody! Do you know this actress name?",model.classify("Hi everbody! Do you know this actress name?"));
    console.log("Do you know this actress name?",model.classify("Do you know this actress name?"));
    console.log("Good video! i like this stuff",model.classify("Good video! i like this stuff"));
  }

  async saveModelToFile(model) {
    const newText = `module.exports = ${JSON.stringify(model, null, 2)}`

    fs.createWriteStream('./model/naiveBayes.js').write(newText);
  }
}