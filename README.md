# decap-plus

Some extension to Decap/CMS, adding "Preview" and "Approve" buttons to the main
CMS panel. Ultimately, this was abandoned, not because it didn't work, but
because the work-flow was cumbersome. I'm just keeping this here for reference
should I need to do something similiar in future.

For the record, to install it, you would do something like this:

```bash
SRC_TREE=/dir/for/this/repo
DST_TREE=/dir/for/hugo/project

mkdir -p $DST_TREE/site/static/admin/panel/decap-plus
cp $SRC_TREE/admin-panel/extension.js $DST_TREE/site/static/admin/panel/decap-plus
echo You should add extension.js to $DST_TREE/site/static/admin/panel/index.html

mkdir -p $DST_TREE/lib
cp $SRC_TREE/lib/util.ts $DST_TREE/lib

mkdir -p $DST_TREE/functions/api/decap-plus
cp $SRC_TREE/api/* $DST_TREE/functions/api/decap-plus
```

Also, the Pages project needs to have the following secrets added:

* `CF_ACCOUNT_ID`
* `CF_API_TOKEN`
* `CF_EDIT_PROJECT`
* `CF_PROD_PROJECT`
* `GITHUB_OWNER`
* `GITHUB_REPO`
* `GITHUB_TOKEN`

`CF_PROD_PROJECT` and `CF_EDIT_PROJECT` are the names of the Pages projects for
the final and draft versions of the website.
