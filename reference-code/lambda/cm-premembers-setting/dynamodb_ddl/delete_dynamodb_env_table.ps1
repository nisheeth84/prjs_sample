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
    Write-Output "Please input ticket number."
    Read-Host "Finish. Please Input Enter."
    return
}

if ([String]::IsNullOrEmpty($profile)){
    Write-Output "AWS CLI Profile is Empty."
    Write-Output "Please input AWS CLI Profile."
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
    $answer = $Host.UI.PromptForChoice("Confirmation","Delete $tableName ?",$choice,0)
    if ($answer -eq 0) {
        Write-Output Delete $tableName
        aws dynamodb delete-table --table-name "$tableName" --profile "$profile"
    }else{
        Write-Output Not Delete $tableName
    }
}
Read-Host "Finish. Please Input Enter."