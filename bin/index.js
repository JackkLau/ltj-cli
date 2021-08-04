#!/usr/bin/env node
console.log('开启牛逼的时刻吧...');
const { program } = require('commander');
const download = require('download-git-repo');
const ora = require('ora');
const chalk = require('chalk');
const logSymbols = require('log-symbols');
const shell = require('shelljs');
const fs = require('fs');
const inquirer = require('inquirer');
const handlebars = require('handlebars');
const path = require('path');

program.version('0.1.0');

program
  .command('create <project>')
  .description('初始化项目模板')
  .action(projectName => {
    // https://www.npmjs.com/package/ora
    const spinner = ora('正在下载模板中...').start();

    // https://www.npmjs.com/package/download-git-repo
    // download的第一个参数是仓库地址#分支
    // 第二个参数是项目名称
    const downloadUrl = 'liutianjiao123/template';
    download(downloadUrl, projectName, err => {
      if (err) {
        spinner.fail();
        return console.log(logSymbols.error, chalk.red('下载模板失败:' + err));
      } else {
        spinner.succeed();
        console.log(logSymbols.success, chalk.green('下载模板成功'));
        inquirer
          .prompt([
            {
              type: 'input',
              name: 'name',
              message: '请输入项目名称',
              default: projectName,
            },
            {
              type: 'input',
              name: 'description',
              message: '请输入项目简介',
              default: '',
            },
            {
              type: 'input',
              name: 'author',
              message: '请输入作者名称',
              default: '',
            },
          ])
          .then(answers => {
            //根据命令行答询结果修改package.json文件
            let packageContent = fs.readFileSync(
              `${projectName}/package.json`,
              'utf8'
            );
            let packageResult = handlebars.compile(packageContent)(answers);
            fs.writeFileSync(`${projectName}/package.json`, packageResult);
            //用chalk和log-symbols改变命令行输出样式
            console.log(logSymbols.success, chalk.green('模板配置成功'));
          })
          .catch(err => {
            console.log(
              logSymbols.error,
              chalk.green('模板项目加载失败' + err)
            );
          });
      }
    });
  });

program
  .command('help')
  .description('查看所有可用的模板帮助')
  .action(env => {
    console.log('这里可以书写相关的帮助信息');
  });

program.parse(process.argv);
