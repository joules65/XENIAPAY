import React, { useCallback, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from 'react-plaid-link'
import { createLinkToken, exchangePublicToken } from '@/lib/actions/user.actions';
import router, { useRouter } from 'next/navigation';
import Image from 'next/image';

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
    const router = useRouter();
    const [token, setToken] = useState('');

    useEffect(() => {
        const getLinkToken = async () => {
            const data = await createLinkToken(user);

            setToken(data?.linkToken);
        }

        getLinkToken();
    }, [user]);

    const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) => {
        await exchangePublicToken({
            publicToken: public_token,
         user,
        })
       router.push('/');

    }, [user])
    const config: PlaidLinkOptions = {
        token,
        onSuccess
    }

    const { open, ready } = usePlaidLink(config);

  return (
   <>
   {variant === 'primary' ? (
    <Button 
        onClick={() => open()}
        disabled={!ready}
        className="plaidlink-primary"
    >
        Connect Your Banks
    </Button>
   ): variant === 'ghost' ? (
    <Button onClick={() => open()} variant="ghost" className='plaidlink-ghost'>
        <p className='hiddenl text-16 font-semibold text-black-2 xl:block'>Connect Your Bank</p>
    </Button>
   ): (
    <Button onClick={() => open()} className='plaidlink-default'>
        <Image
            src="/icons/connect-bank.svg"
            alt='connect bank'
            width={24}
            height={24}
        />
         <p className='text-16 font-semibold text-black-2'>Connect Your Bank</p>
    </Button>
   )}
   </>
  )
}

export default PlaidLink