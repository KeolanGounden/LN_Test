# ChangeTracker

### Building the image

The image with an incremented tag can be geanerated using the **build-docker.ps1** script found in the root drrectory

##### How the script works

<ul>

<li>Parameters: The param block at the top defines a new parameter, $VersionPart, which accepts a specific set of strings ('major', 'minor', 'patch'). 
This ensures you must explicitly state what you want to increment.</li>
<li>Version parsing: The script uses the [version] type accelerator to parse the version string from the text file. This automatically separates the major, minor, and patch numbers, making them easy to work with.</li>
<li>Conditional increment: A switch statement is used to perform the correct increment based on the value of $VersionPart. If you increment a major or minor version, the more granular version numbers are automatically reset to zero, following standard semantic versioning practices.</li>
<li>Type conversion and rebuilding: The script converts the version object back to a string for tagging and writing to the version.txt file.</li>

</ul>


#### Use a specific Dockerfile


To use a different Dockerfile than the default Dockerfile in your project root, provide the path to it using the -Dockerfile parameter. 

Example 1: Using **valuetrackerapi.dockerfile**

This command increments the patch version and uses a file named **valuetrackerapi.dockerfile** in the current directory.

> .\build-docker-semver.ps1 -Dockerfile valuetrackerapi.dockerfile -VersionPart patch

### Generating Signal R TypeScript Client

The signal r frontend client is generated using this [package](https://github.com/nenoNaninu/TypedSignalR.Client.TypeScript)

In the project console, change directory to the project with the signal r hub defination and run the following command. 

> dotnet tsrts --project ChangeTrackerAPI.csproj --output SignalRGenerated

Copy the contents of the generated file to the frontend