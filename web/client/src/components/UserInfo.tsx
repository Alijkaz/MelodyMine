"use client"
import {Image} from "@nextui-org/image";
import {FaUserAlt} from "react-icons/fa";
import {TbPlugConnected, TbPlugConnectedX} from "react-icons/tb";
import {RxExit} from "react-icons/rx";
import StartButton from "@/components/StartButton";
import {signOut, useSession} from "next-auth/react";
import {useUserStore} from "@/store/UserStore";
import {useValidateStore} from "@/store/ValidateStore";
import {IOnlineUsers, IPlayerStatus, ISoundSettings, IUser} from "@/interfaces";
import {BsFillMicMuteFill, BsFillPeopleFill} from "react-icons/bs";
import {useOnlineUsersStore} from "@/store/OnlineUsersStore";
import {useEffect, useState} from "react";
import {ImUserTie} from "react-icons/im";
import {useSocketStore} from "@/store/SocketStore";
import {decrypt} from "@/utils";
import {ISound, useSoundStore} from "@/store/SoundStore";
import Settings from "@/components/Settings";
import {PiArrowFatLineRightFill} from "react-icons/pi";


interface UserInfoProps {
    user: IUser,
    websocketKey?: string
}

const UserInfo = ({user, websocketKey}: UserInfoProps) => {
    const {server, setSecretKey, isMute} = useUserStore(state => state)

    const {isValidate} = useValidateStore(state => state)
    const {initSounds, soundList, setSoundSettings, setPlayerStatus} = useSoundStore(state => state)
    const {socket} = useSocketStore(state => state)
    const {users} = useOnlineUsersStore(state => state)
    const {status} = useSession()
    const [userIsAdminMode, setUserIsAdminMode] = useState<boolean>(false)
    const [playingSounds, setPlayingSounds] = useState<ISound[]>([])
    const onAdminModeEnableReceive = (token: string) => {
        const data = decrypt(token) as {
            uuid: string,
            server: string
        }
        if (data.uuid != user.uuid) return
        setUserIsAdminMode(true)
    }

    const onAdminModeDisableReceive = (token: string) => {
        const data = decrypt(token) as {
            uuid: string
        }
        if (data.uuid != user.uuid) return
        setUserIsAdminMode(false)
    }

    const onPlaySoundReceive = (token: string) => {
        const data = decrypt(token) as {
            sound: string
            volume?: number
        }
        const sound = soundList.find(item => item.name == data.sound)
        if (!sound) return
        const howl = sound?.howl
        if (!playingSounds.find(sound => sound.name == data.sound)) {
            if (data.volume) howl?.volume(data.volume)
            howl?.play()
            setPlayingSounds(prevState => [...prevState, sound])
            howl?.once("end", () => {
                setPlayingSounds(prevState => [...prevState.filter(s => s.name != sound.name)])
            })
        }
    }

    const onStopSoundReceive = (token: string) => {
        const data = decrypt(token) as {
            sound: string
        }
        const sound = soundList.find(item => item.name == data.sound)
        if (!sound) return
        const howl = sound?.howl
        if (howl?.state() == "loading") {
            howl.unload()
        }
        howl?.stop()
        setPlayingSounds(prevState => [...prevState.filter(s => s.name != sound.name)])
    }

    const onPauseSoundReceive = (token: string) => {
        const data = decrypt(token) as {
            sound: string
        }
        const sound = soundList.find(item => item.name == data.sound)?.howl
        sound?.pause()
    }


    const onVolumeSoundReceive = (token: string) => {
        const data = decrypt(token) as {
            sound: string
            volume: number
        }
        const sound = soundList.find(item => item.name == data.sound)?.howl
        sound?.volume(data.volume)
    }

    const onSoundSettingReceive = (token: string) => {
        const data = decrypt(token) as {
            soundSettings: ISoundSettings
            playerStatus: IPlayerStatus[]
        }
        setPlayerStatus(data.playerStatus)
        setSoundSettings(data.soundSettings)
    }

    const onPlayerLeaveReceivePlugin = (token: string) => {
        const onlineUser = decrypt(token) as IOnlineUsers
        if (onlineUser.uuid == user.uuid) {
            soundList.forEach(sound => sound.howl.stop())
        }
    }

    const onPluginDisabled = () => {
        soundList.forEach(sound => sound.howl.stop())
    }

    const onPlayerChangeServer = (token: string) => {
        const data = decrypt(token) as {
            name: string,
            uuid: string,
            server: string
        }
        if (data.uuid == user.uuid) {
            soundList.forEach(sound => sound.howl.stop())
        }
    }

    useEffect(() => {
        setSecretKey(websocketKey!!)
        initSounds()
    }, [])

    useEffect(() => {
        socket?.on("onVolumeSoundReceive", onVolumeSoundReceive)
        socket?.on("onPlayerLeaveReceivePlugin", onPlayerLeaveReceivePlugin)
        socket?.on("onPluginDisabled", onPluginDisabled)
        socket?.on("onPlayerChangeServer", onPlayerChangeServer)
        socket?.on("onAdminModeEnableReceive", onAdminModeEnableReceive)
        socket?.on("onAdminModeDisableReceive", onAdminModeDisableReceive)
        socket?.on("onPlaySoundReceive", onPlaySoundReceive)
        socket?.on("onPauseSoundReceive", onPauseSoundReceive)
        socket?.on("onStopSoundReceive", onStopSoundReceive)
        socket?.on("onSoundSettingReceive", onSoundSettingReceive)

        return () => {
            socket?.off("onVolumeSoundReceive", onVolumeSoundReceive)
            socket?.off("onPlayerLeaveReceivePlugin", onPlayerLeaveReceivePlugin)
            socket?.off("onPluginDisabled", onPluginDisabled)
            socket?.off("onPlayerChangeServer", onPlayerChangeServer)
            socket?.off("onAdminModeEnableReceive", onAdminModeEnableReceive)
            socket?.off("onAdminModeDisableReceive", onAdminModeDisableReceive)
            socket?.off("onPlaySoundReceive", onPlaySoundReceive)
            socket?.off("onPauseSoundReceive", onPauseSoundReceive)
            socket?.off("onStopSoundReceive", onStopSoundReceive)
            socket?.off("onSoundSettingReceive", onSoundSettingReceive)
        }

    }, [socket, soundList, playingSounds])

    useEffect(() => {
        if (isValidate) return
        setUserIsAdminMode(false)
    }, [isValidate])

    return (
        <div className="flex flex-col rounded-[10px] px-3 py-1 bg-custom shadow-xl w-full" style={{padding: '1rem'}}>
            <div className="flex justify-between">
                <div className="flex justify-start items-center">
                    <Image
                        src={`https://mc-heads.net/head/${user.name}`}
                        alt="" width={70} height={70}
                        className="object-contain"
                    />
                    <div className="mr-2">
                        <h1 className="text-white flex items-center w-full">
                            <span className="mr-2 hidden sm:block">
                                <FaUserAlt/>
                            </span>
                            <span className="capitalize" style={{paddingTop: '0.3rem', paddingRight: '0.5rem'}}>
                                {user.name}
                            </span>
                            <div className="flex items-center">
                                {isMute ? (
                                    <div className="ms-2 self-center">
                                        <span
                                            className="whitespace-nowrap ring-1 ring-red-900 text-xs font-medium mr-2 px-1.5 py-0.5 rounded-[10px] dark:bg-red-500 dark:text-white flex">
                                            <span className="me-1 self-center hidden sm:block">
                                                <BsFillMicMuteFill/>
                                            </span>
                                            میوت کردن
                                        </span>
                                    </div>
                                ) : ""}
                                {userIsAdminMode ? (
                                    <div className="ms-2 self-center">
                                    <span
                                        className="ring-1 ring-cyan-900 text-xs font-medium mr-2 px-1.5 py-0.5 rounded-[10px] dark:bg-cyan-500 dark:text-white flex">
                                        <span className="me-1 self-center hidden sm:block">
                                            <ImUserTie/>
                                        </span>
                                        مدیر
                                    </span>
                                    </div>
                                ) : ""}
                            </div>
                        </h1>

                        <div className="my-1 btn-gradient w-full h-[1px] rounded-[10px]"/>

                        <h3 className={`text-sm text-white ${isValidate ? "bg-emerald-500" : "bg-red-500"}  px-3 py-1 rounded-[10px] flex items-center w-fit`}>
                            <span className="text-xl ml-1 hidden sm:block">
                                {isValidate ? <TbPlugConnected/> : <TbPlugConnectedX/>}
                            </span>
                            <span className="capitalize">
                                {isValidate ? "متصل" : "قطع"}
                            </span>
                        </h3>
                    </div>
                </div>
                <div className="flex flex-col justify-between my-1.5 text-white">
                    <div className="flex gap-2 justify-end items-center">
                        <Settings/>
                        <button disabled={status == "loading"} className="text-red-500 cursor-pointer text-xl"
                                onClick={() => signOut({
                                    redirect: true,
                                    callbackUrl: "/login"
                                })}>
                            <RxExit/>
                        </button>
                    </div>
                    <StartButton/>
                </div>
            </div>
            <div className="my-1 btn-gradient w-full h-[1px] rounded-[10px] flex justify-between"/>
            <div className="w-full flex justify-between items-center">
                <h3 className="flex items-center text-white">
                    <span className="px-1">
                        <PiArrowFatLineRightFill/>
                    </span>
                    متصل به:
                    {isValidate ? (<>
                        <span className="ml-1 mr-2 font-bold text-green-500">
                            {isValidate ? server : ""}
                        </span>
                        <span className="ms-1">
                            <BsFillPeopleFill/>
                        </span>
                        <span className="ms-1">
                            {users.filter(item => item.server == server).length}
                        </span>
                    </>) : ""}
                </h3>
                <div
                    className="text-transparent bg-clip-text bg-gradient-to-r from-[#e20a3e] to-[#9b0d2e] flex items-center">
                    بازیکن
                    <span className="ms-1">
                        {users.length}
                    </span>
                    <span className="ms-1 text-[#e20a3e]">
                        <BsFillPeopleFill/>
                    </span>
                </div>
            </div>
        </div>
    )
}
export default UserInfo
