cd /c/Work/react-uwp
# rm -rf ../multiple-queue-recorder/node_modules/react-uwp
# rm -rf ../multiple-queue-recorder/build

tsc-watch --rootDir ./src --outDir ../multiple-queue-recorder/node_modules/react-uwp -w --onSuccess "cp ./src/index.d.ts -r ../multiple-queue-recorder/node_modules/react-uwp/index.d.ts" 
# cp ./src/index.d.ts -r ../multiple-queue-recorder/node_modules/react-uwp/index.d.ts
# cp  ./package.json -r ../multiple-queue-recorder/node_modules/react-uwp/package.json
# cd ../multiple-queue-recorder/node_modules/react-uwp && npm install --only=prod
cd /c/Work/react-uwp
