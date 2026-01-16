@echo off
cd /d "%~dp0"
forge script script\DeploySimple.s.sol:DeploySimple --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast --legacy
