"""Direct Mode helpers pinned to the stable GenVM bundle."""
from pathlib import Path
import pytest
from gltest.direct.loader import deploy_contract

DIRECT_SDK_VERSION="v0.2.16"

@pytest.fixture
def direct_deploy(direct_vm):
    def _deploy(contract_path,*args,**kwargs):
        path=Path(contract_path)
        if not path.is_absolute(): path=path.resolve()
        return deploy_contract(path,direct_vm,*args,sdk_version=DIRECT_SDK_VERSION,**kwargs)
    return _deploy
