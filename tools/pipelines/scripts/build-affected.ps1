$AffectedAppsObj = Invoke-Expression "npx nx show projects -t build --affected --base=origin/master";
$AffectedAppsString = $AffectedAppsObj -join ' ';

if (!$AffectedAppsString -and $AffectedAppsString -eq "") {
    Write-Host "No affected apps. Building all apps.";
    Invoke-Expression 'npx nx run-many -t=build --prod --all';
    return;
}

Invoke-Expression 'npm run affected:build -- --base=origin/master --head=HEAD --prod';
