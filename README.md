## Database setup

In **appsettings.json** modify the connections string:

```
"ApiConnection": "Host=localhost;Database=musicshareapi;Username=postgres;Password=postgres;",
"MusicShareConnection": "Host=localhost;Database=musicshare;Username=postgres;Password=postgres;",
"HangfireConnection": "Server=*****\\SQLEXPRESS;Database=HangfireTest;Trusted_Connection=True;MultipleActiveResultSets=true"
```

Powershell (add a new migration):

```
$ add-migration migrationName
$ update-database
```

If necessary, remove the latest migration with:

`$ remove-migration`

Also modify mail credentials settings:

```
 "Mail": {
    "Address": "*****",
    "DisplayName": "*****",
    "Password": "*****"
  }
```
