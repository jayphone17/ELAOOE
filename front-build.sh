CURPATH=$(pwd)
echo "前端资源构建中"
echo $CURPATH/elaooe-admin/
cd $CURPATH/elaooe-admin/
yarn
yarn build
cd $CURPATH/elaooe-mentor/
yarn
yarn build
cd $CURPATH/elaooe-student/
yarn
yarn build

cp -r $CURPATH/elaooe-admin/dist $CURPATH/build/admin
cp -r $CURPATH/elaooe-mentor/dist $CURPATH/build/mentor
cp -r $CURPATH/elaooe-student/dist $CURPATH/build/student