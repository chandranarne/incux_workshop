Add-Type -AssemblyName System.Drawing

function Optimize-Image {
    param(
        [string]$SourcePath,
        [string]$DestinationPath,
        [int]$MaxDimension = 1400,
        [long]$Quality = 82
    )

    try {
        $img = [System.Drawing.Image]::FromFile($SourcePath)

        # Handle EXIF orientation if present
        $orientationId = 0x0112
        $rotation = [System.Drawing.RotateFlipType]::RotateNoneFlipNone
        if ($img.PropertyIdList -contains $orientationId) {
            $prop = $img.GetPropertyItem($orientationId)
            $val = $prop.Value[0]
            if ($val -eq 6) { $rotation = [System.Drawing.RotateFlipType]::Rotate90FlipNone }
            elseif ($val -eq 8) { $rotation = [System.Drawing.RotateFlipType]::Rotate270FlipNone }
            elseif ($val -eq 3) { $rotation = [System.Drawing.RotateFlipType]::Rotate180FlipNone }
        }
        if ($rotation -ne [System.Drawing.RotateFlipType]::RotateNoneFlipNone) {
            $img.RotateFlip($rotation)
        }

        $scale = [Math]::Min(1.0, [Math]::Min($MaxDimension / $img.Width, $MaxDimension / $img.Height))
        $newW = [int]($img.Width * $scale)
        $newH = [int]($img.Height * $scale)

        $bmp = New-Object System.Drawing.Bitmap($newW, $newH)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $g.DrawImage($img, 0, 0, $newW, $newH)

        $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)

        $destDir = [System.IO.Path]::GetDirectoryName($DestinationPath)
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }

        $bmp.Save($DestinationPath, $codec, $encoderParams)
        $g.Dispose()
        $bmp.Dispose()
        $img.Dispose()

        $fi = Get-Item $DestinationPath
        Write-Host "Processed $([System.IO.Path]::GetFileName($DestinationPath)) ($([math]::Round($fi.Length / 1KB, 1)) KB)"
    } catch {
        Write-Error "Failed to process $SourcePath : $_"
    }
}

$baseSrc = "D:\incux_workshop\photos"
$baseDest = "D:\incux_workshop\frontend\src\assets\events"

# 1. Guest lectures
Write-Host "--- Optimizing Guest Lectures ---"
$glFiles = Get-ChildItem -Path "$baseSrc\guest lectures" -Filter "*.jpg" | Sort-Object Name
$i = 1
foreach ($f in $glFiles) {
    $num = "{0:D2}" -f $i
    Optimize-Image -SourcePath $f.FullName -DestinationPath "$baseDest\guest_lectures\guest_lecture_$num.jpg"
    $i++
}

# 2. Hackathons
Write-Host "--- Optimizing Hackathons ---"
$hFiles = Get-ChildItem -Path "$baseSrc\hackathons" -Filter "*.jpg" | Sort-Object Name
$i = 1
foreach ($f in $hFiles) {
    $num = "{0:D2}" -f $i
    Optimize-Image -SourcePath $f.FullName -DestinationPath "$baseDest\hackathons\hackathon_$num.jpg"
    $i++
}

# 3. Workshops
Write-Host "--- Optimizing Workshops ---"
$wFiles = Get-ChildItem -Path "$baseSrc\workshop" -Filter "*.jpg" | Sort-Object Name
$i = 1
foreach ($f in $wFiles) {
    $num = "{0:D2}" -f $i
    Optimize-Image -SourcePath $f.FullName -DestinationPath "$baseDest\workshops\workshop_$num.jpg"
    $i++
}

Write-Host "Optimization complete!"
