#!/usr/bin/env node
console.log('开启牛逼的时刻吧...');
const { program } = require('commander');
const download = require('download-git-repo');
const ora = require('ora');
const chalk = require('chalk');
const logSymbols = require('log-symbols');

program.version('0.1.0');

program
  .command('create <project>')
  .description('初始化项目模板')
  .action(project => {
    // https://www.npmjs.com/package/ora
    const spinner = ora('正在下载模板中...').start();

    // https://www.npmjs.com/package/download-git-repo
    // download的第一个参数是仓库地址#分支
    // 第二个参数是项目名称
    const downloadUrl = 'liutianjiao123/template';
    download(downloadUrl, project, err => {
      if (err) {
        console.log('err : >>', err);
        spinner.fail();
        return console.log(logSymbols.error, chalk.red('下载模板失败:' + err));
      } else {
        spinner.succeed();
        return console.log(logSymbols.success, chalk.green('下载模板成功'));
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
