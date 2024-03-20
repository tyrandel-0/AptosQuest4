\
Aptos quest 4 onchain
--------------------------
Выполняет все ончейн действия для 4 квеста:

1) Свапает 0.001 APT на USDT на PancakeSwap (USDT понадобятся для VibrantX)
2) Делает supply USDT в одну из стратегий на VibrantX
3) Свапает 0.001 APT на CELL на Cellana
4) Лочит полученные CELL на 2 месяца для голосования 
5) Выполняет голосование на Cellana

### 1\. Установка Node.js

Убедитесь, что у вас установлен Node.js. Вы можете скачать его с [официального сайта Node.js](https://nodejs.org/).

### 2\. Установка зависимостей

Откройте терминал и перейдите в папку с проектом. Затем выполните команду:

`npm install`

Это установит все необходимые зависимости из файла `package.json`.

### 3\. Настройка

Для корректной работы программы необходимо заполнить следующие файлы:

-   `private_keys`: Файл с приватными ключами.
-   `config.json`: Файл конфигурации программы, где необходимо указать следующие параметры:
    -   `DelayTimeRange`: Задержка между ончейн действиями выбирается рандомно между `timeSecMin` и `timeSecMax`. Задается в секундах

### 4\. Запуск программы

После заполнения файлов и конфигурации, выполните следующую команду в терминале:

`npm start`