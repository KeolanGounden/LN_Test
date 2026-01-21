# Requires -Version 5.1

# Define the script's parameters.
param(
    [ValidateSet("major", "minor", "patch")]
    [string]$VersionPart,
    [string]$Dockerfile 
)

# Define your Docker image details.
$ImageName = "asp-value-change-tracker"
$VersionFile = ".\version.txt"
$Repository = "your-docker-repo" # e.g., "your-docker-username/your-app-name"
$OutputPath = ".\asp-value-change-tracker.tar" # Replace with your desired output path




Write-Host "Checking for version file: $VersionFile"

# Read the current version number from the file.
# Using [version] type saves the need for manual string manipulation.
try {
    $currentVersion = [version](Get-Content -Path $VersionFile)
} catch {
    Write-Warning "Version file not found or invalid format. Creating and initializing with 1.0.0."
    $currentVersion = [version]"1.0.0"
}

# Increment the specified version part.
$major = $currentVersion.Major
$minor = $currentVersion.Minor
$patch = $currentVersion.Build # In [version], the "patch" is the "build" number.

if($VersionPart)
{
    switch ($VersionPart) 
    {
    'major' {
        $major += 1
        $minor = 0
        $patch = 0
    }
    'minor' {
        $minor += 1
        $patch = 0
    }
    'patch' {
        $patch += 1
    }
   }
}
else
{
     $patch += 1
}


# Rebuild the version string.
$newVersion = "$major.$minor.$patch"
$latestTag = "latest"
Write-Host "New image tag: ${ImageName}:${newVersion}"
Write-Host "Updating latest tag to: ${ImageName}:$latestTag"

# Build the Docker image with the new and 'latest' tags.
Write-Host "Building Docker image..."

if($Dockerfile)
{
    docker build -f "$Dockerfile" -t "${ImageName}:$newVersion" -t "${ImageName}:${latestTag}" .
}
else
{
   docker build -t "${ImageName}:$newVersion" -t "${ImageName}:${latestTag}" .
}



# Check if the build was successful before proceeding.
if ($LASTEXITCODE -eq 0) {
    # Update the version file with the new version number.
    Write-Host "Docker build successful. Updating version file..."
    Set-Content -Path $VersionFile -Value "$newVersion"

    # Optional: Push the images to a remote registry.
    # Write-Host "Pushing Docker images to registry: $Repository"
    # docker tag "$ImageName:$newVersion" "$Repository:$newVersion"
    # docker tag "$ImageName:$latestTag" "$Repository:$latestTag"
    # docker push "$Repository:$newVersion"
    # docker push "$Repository:$latestTag"


    # --- Save the Docker Image as a Tar File ---
    Write-Host "Saving Docker image to $($OutputPath)..."
    docker image save -o $outputPath "$($ImageName):$($newVersion)"
    if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker image save failed. Exiting."
    exit $LASTEXITCODE
    }
    Write-Host "Docker image saved successfully to $($outputPath)."


} else {
    Write-Host "Docker build failed. Version file was not updated."
}


