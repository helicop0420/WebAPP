import Header from "./Header";
import About from "./About";
import Projects from "./Projects";
import Endorsements from "./Endorsements";
import { useState } from "react";
import { useRouter } from "next/router";
import Modal from "www/shared/components/modal/Modal";
import EditProfileForm from "./EditProfileForm";
import ModalWrapper from "www/shared/components/modal/ModalWrapper";
import AddEndorsementModal from "./AddEndorsementModal";
import { useQuery } from "react-query";
import {
  ProfileQueryKey,
  fetchProfileView,
  fetchOrganizationsList,
} from "./Profile.fetchers";

export default function Profile() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openAddEndorsementModal, setOpenAddEndorsementModal] = useState(false);

  const { handle } = router.query;

  const { data: res } = useQuery({
    queryKey: [ProfileQueryKey.ProfileView, handle],
    queryFn: () => fetchProfileView(handle as string),
    onError: (err) => {
      console.log("err", err);
    },
  });
  const { data: orgRes } = useQuery({
    queryKey: [handle],
    queryFn: () => fetchOrganizationsList(),
    onError: (err) => {
      console.log("err", err);
    },
  });

  const profileData = res?.data;
  const organizations = orgRes?.data;
  return (
    <>
      <div className="bg-gray-100 py-4 justify-center box-border w-full grid">
        {profileData && (
          <div className="grid px-8 gap-4 box-border grid-cols-1 max-w-7xl">
            <Modal open={open} setOpen={setOpen} title="Edit Profile">
              <EditProfileForm
                profile={profileData}
                setModal={setOpen}
                organizations={organizations ?? []}
              />
            </Modal>
            <ModalWrapper
              open={openAddEndorsementModal}
              setOpen={setOpenAddEndorsementModal}
            >
              <AddEndorsementModal
                setOpen={setOpenAddEndorsementModal}
                title="Endorse"
                firstName={profileData.first_name}
                lastName={profileData.last_name}
                position={profileData.current_org_position}
                picUrl={profileData.profile_pic_url}
                isVerified={profileData.is_verified}
                userId={profileData.user_id as string}
              />
            </ModalWrapper>
            <Header profile={profileData} openEditModal={setOpen} />
            <About profile={profileData} />
            <Projects profile={profileData} />
            <Endorsements
              endorsements={profileData?.endorsements}
              setOpenAddEndorsementModal={setOpenAddEndorsementModal}
            />
          </div>
        )}
      </div>
    </>
  );
}
