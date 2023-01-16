import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto';

import * as fs from 'fs';
import * as limdu from 'limdu';
import * as spamfilter from 'spam-filter';

import * as natural from 'natural';

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
      //const spamFilter = require(`spam-filter/naiveBayes`);
      //const spamFilter = limdu.classifiers.Bayesian();
      //const model = new natural.BayesClassifier();
      //spamFilter.generate();
      const spamFilter = spamfilter('naiveBayes');
      //const spamFilter =spamfilter('fisher');
      const csv = require('csv-parser');
      const inputFilePath = './files/train.csv';
      fs.createReadStream(inputFilePath)
        .pipe(csv())
        .on('data', function(data){
          //const isSpam = data.class === "1" ? 'spam' : 'ham'; 
          //model.addDocument(data.comment, isSpam);
          const isSpam = data.class === "spam" ? 'bad' : 'good'; 
          spamFilter.train(data.comment, isSpam);
      }).on('end', function(){
        //model.train();
        //resolve(model);
        //spamFilter.setThreshold('bad',0.4);
        //console.log(spamFilter.getThreshold('bad'));
        resolve(spamFilter);
        console.log(spamFilter.classify("Subscribe to my channel"));
        console.log(spamFilter.classify("What is the actress name?"));
        console.log(spamFilter.classify("Check my channel, please!"));
        console.log("Check my channel, please!", spamFilter.classify("Check my channel, please!"));
        console.log("subscribe to my channel", spamFilter.classify("subscribe to my channel"));
        console.log("just for test I have to say murdev.com", spamFilter.classify("just for test I have to say murdev.com"));
        console.log("fuck fuck fuck fuck", spamFilter.classify("fuck fuck fuck fuck"));
        console.log("just for test I have to say test.com", spamFilter.classify("just for test I have to say test.com"));
        console.log(" test.com", spamFilter.classify(" test.com"));      
        console.log("Oh i like this song so much!!!!",spamFilter.classify("Oh i like this song so much!!!!"));      
        console.log("Check out this link!",spamFilter.classify("Check out this link!"));
        console.log("Check out this link www.com.test",spamFilter.classify("Check out this link www.com.test")); 
        console.log("Hi everbody! Do you know this actress name?",spamFilter.classify("Hi everbody! Do you know this actress name?"));
        console.log("Do you know this actress name?",spamFilter.classify("Do you know this actress name?"));
        console.log("Good video! i like this stuff",spamFilter.classify("Good video! i like this stuff"));
        spamFilter.save();
        return spamFilter;
      }); 
    });
  }

  async trainModel() {

    //const model:any = await this.getModel();// new natural.BayesClassifier();
    //const spamFilter: any = await this.getModel();
    //await this.saveModelToFile(spamFilter);
    //await this.testModel(model);
    //const model:natural.BayesClassifier = JSON.parse(await this.uploadModelFromFile('./model/naiveBayesclassifier.json'));

    const spamFilter:any = this.getModel();
    //const spamFilter = spamfilter('naiveBayes');
    //spamFilter.generate();
    //this.getModel(spamFilter);

    //spamFilter.save();
    //this.saveModelToFile(spamFilter);
    //spamfilter.save(spamFilter);
/*     let model: natural.BayesClassifier;
    natural.BayesClassifier.load('./model/naiveBayesclassifier.json', null, function (err, classifier) {
      return new Promise(function (resolve, reject) {
        //console.log(classifier);
        model = classifier;
        resolve(model);
        });
      }); */
    //const filter = require('natural');
    //filter.init(model); 
    //console.log(model);
/*     console.log(model.classify('What is the actress name?'));
    await this.testModel(model); */
    //model.save('./model/naiveBayesclassifier.json' , function(err, classifier) {})
    //await this.saveModelToFile(spamFilter);

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

  async testModel(model:natural.BayesClassifier){
    console.log(model.classify("Check my channel, please!"));
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

  async uploadModelFromFile(filename) : Promise<any> {
    return new Promise(function (resolve, reject) {
      fs.readFile(filename, 'utf8', function (err, data) {
        resolve(data);})
      });
  }
}