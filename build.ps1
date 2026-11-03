# 공식 사진을 넣은 게시용 파일을 dist/에 만든다.
# official-photos/camry_card.jpg, rav4_card.jpg가 없으면 사진 없이(기본 그림) 만든다.
$root = $PSScriptRoot
$src = Join-Path $root 'car-decision-helper.html'
$dist = Join-Path $root 'dist'
New-Item -ItemType Directory -Force $dist | Out-Null

$t = [IO.File]::ReadAllText($src, [Text.Encoding]::UTF8)
foreach ($pair in @(@('camry', '__CAMRY_JPG__'), @('rav4', '__RAV4_JPG__'))) {
  $jpg = Join-Path $root "official-photos\$($pair[0])_card.jpg"
  if (Test-Path $jpg) {
    $t = $t.Replace($pair[1], [Convert]::ToBase64String([IO.File]::ReadAllBytes($jpg)))
  } else {
    Write-Output "사진 없음: $jpg (기본 그림 사용)"
  }
}
$out = Join-Path $dist 'car-decision-helper.html'
[IO.File]::WriteAllText($out, $t, (New-Object Text.UTF8Encoding $false))
Write-Output "만들었어요: $out ($([math]::Round((Get-Item $out).Length / 1KB))KB)"
