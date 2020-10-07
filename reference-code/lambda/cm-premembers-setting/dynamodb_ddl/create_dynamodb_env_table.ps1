Param( $paramTicketNumber, $paramProfile )
$inputTicketNumber = Read-Host "Please Input your ticket number Default $paramTicketNumber"
if([String]::IsNullOrEmpty($inputTicketNumber)){
    $ticketNumber = $paramTicketNumber
}else{
    $ticketNumber = $inputTicketNumber
}
$inputProfile = Read-Host "Please Input your AWS CLI Profile Default $paramProfile"
if([String]::IsNullOrEmpty($inputProfile)){
    $profile = $paramProfile
}else{
    $profile = $inputProfile
}
if ([String]::IsNullOrEmpty($ticketNumber)){
    Write-Output "Ticket number is Empty."
    Write-Output "Please Input ticket number."
    Read-Host "Finish. Please Input Enter."
    return
}

if ([String]::IsNullOrEmpty($profile)){
    Write-Output "AWS CLI Profile is Empty."
    Write-Output "Please Input AWS CLI Profile."
    Read-Host "Finish. Please Input Enter."
    return
}
Write-Output "ticket number: $ticketNumber"
Write-Output "profile: $profile"
$scriptPath = $MyInvocation.MyCommand.Path
$parentPath = Split-Path -Parent $scriptPath  
Write-Output $parentPath
$filenames = (Get-Content dynamodb_table.lst) -as [string[]]
foreach ($filename in $filenames) {
    $typename = "Management.Automation.Host.ChoiceDescription"
    $yes = New-Object $typename("&Yes","é¿çsÇ∑ÇÈ")
    $no = New-Object $typename("&NO","é¿çsÇµÇ»Ç¢")
    $choice = [Management.Automation.Host.ChoiceDescription[]]($yes,$no)
    $tableName = $ticketNumber + "_" + $filename
    $answer = $Host.UI.PromptForChoice("Confirmation","Create $tableName ?",$choice,0)
    if ($answer -eq 0) {
        Write-Output Create $tableName 
        aws dynamodb create-table --table-name "$tableName" --cli-input-json "file://$parentPath/$filename.json" --profile "$profile"
        $ttl_json = $filename +"_TTL.json"
        if(Test-Path "$parentPath/$ttl_json"){
            Write-Output "Waiting for create Table."
            aws dynamodb wait table-exists --table-name "$tableName" --profile "$profile"
            Write-Output Setting TTL $tableName 
            aws dynamodb update-time-to-live --table-name "$tableName" --cli-input-json "file://$parentPath/$ttl_json" --profile "$profile"
        }
    }else{
        Write-Output Not create $tableName
    }
}
Read-Host "Finish. Please Input Enter."